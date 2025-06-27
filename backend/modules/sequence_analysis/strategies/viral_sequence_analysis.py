import json
import pathlib
import re
import subprocess
import tempfile
from io import StringIO
from os import popen
from Bio import SeqIO
from werkzeug.utils import secure_filename
import time
from backend.modules.core.exceptions import (
    SequenceAnalysisFailedException,
    GenomicErrorException,
)
from backend.config import get_project_path
from backend.modules.sequence_analysis.response_models import (
    ViralSequenceAnalysisResponseModel,
)
from backend.modules.sequence_analysis.strategies.sequence_analysis_strategy import (
    SequenceAnalysisStrategy,
    sio,
)


class ViralSequenceAnalysis(SequenceAnalysisStrategy):
    """Concrete analysis strategy for viral sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.type = "viral"
        self.sequences = {
            entry.id: str(entry.seq)
            for entry in SeqIO.parse(StringIO(self.fasta_content), "fasta")
        }

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        try:
            illegal_characters = []
            for sequence in self.sequences.values():
                illegal_characters = illegal_characters + re.findall(
                    "[^ATGCRYSWKMBDHVNXU]+", sequence
                )
                print(illegal_characters)
            return illegal_characters
        except Exception as e:
            for fasta_hash in self.sequences.keys():
                sio.emit(
                    "sequence_analysis_response",
                    {
                        "status": "error",
                        "fasta_hash": fasta_hash,
                    },
                    to=f"{self.type}_{self.socket_id}",
                )
            raise GenomicErrorException

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        temp_dir = f"{get_project_path()}/temp_data/sequence_analysis/"
        pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        self.input = tempfile.NamedTemporaryFile(
            dir=temp_dir, suffix=".fa", delete=False
        ).name
        with open(file=self.input, mode="w", encoding="utf-8") as input_file:
            input_file.write(self.fasta_content)

        self.output = self.input[:-2] + "json"

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = subprocess.run(
            [
                f"{get_project_path()}/modules/sequence_analysis/scripts/viral.sh",
                self.input,
                self.output,
                f"{get_project_path()}/modules/sequence_analysis/schemes/{secure_filename(self.pathogen.scheme_name)}",
            ],
            check=False,
        )
        if process.returncode != 0:
            pathlib.Path(self.input).unlink(missing_ok=True)
            pathlib.Path(self.output).unlink(missing_ok=True)
            raise SequenceAnalysisFailedException
        else:
            with open(file=self.output, mode="r", encoding="utf-8") as json_file:
                # check for script errors
                content = json.load(json_file)
                if content["errors"] and len(content["errors"]) > 0:
                    raise GenomicErrorException
                content = content["results"]
                # delete the temporary files. If they can not be found ignore it
                pathlib.Path(self.input).unlink(missing_ok=True)
                pathlib.Path(self.output).unlink(missing_ok=True)
                return content

    def persist_and_emit_response(self, results):
        for result_per_sequence in results:
            response = self.get_response(result_per_sequence)
            fasta_hash = response[0]
            sequence_analysis_result = response[1]
            self.persist_result(
                fasta_hash,
                sequence_analysis_result,
            )
            sio.emit(
                "sequence_analysis_response",
                {
                    "status": "success",
                    "result": sequence_analysis_result,
                    "fasta_hash": fasta_hash,
                },
                to=f"{self.type}_{self.socket_id}",
            )

    def get_response(self, result):
        """Return a response model for viral analysises."""
        # retrieve the installed nextclade version (gentrain-worker and gentrain-backend versions are synced)
        # Nextclade_pango does only exist for sequences of SARS-CoV-2
        nextclade_version = (
            popen("nextclade -V")
            .read()
            .replace("nextclade", "")
            .replace("\n", "")
            .strip()
        )
        return (
            result["seqName"],
            ViralSequenceAnalysisResponseModel(
                sequence_length=len(self.sequences[result["seqName"]]),
                nextclade_version=nextclade_version,
                lineage=(
                    f"{result['clade']}{', ' + result['customNodeAttributes']['Nextclade_pango'] if 'Nextclade_pango' in result['customNodeAttributes'] else ''}"
                    if "clade" in result
                    else None
                ),
                analysis_schema=self.pathogen.scheme_name,
                n_count=result["totalMissing"],
                substitutions=result["substitutions"],
                deletions=result["deletions"],
                insertions=result["insertions"],
                missing=result["missing"],
                nonACGTNs=result["nonACGTNs"],
                alignmentRange=result["alignmentRange"],
            ).model_dump(),
        )

    def emit_enqueued_event(self):
        for fasta_hash in self.sequences.keys():
            sio.emit(
                "sequence_analysis_enqueued",
                fasta_hash,
                to=f"{self.type}_{self.socket_id}",
            )
            self.redis_connection.hmset(
                f"client:sequence_analysis:{fasta_hash}",
                {
                    "enqueued_at": time.time(),
                },
            )
            self.redis_connection.expire(
                name=f"client:sequence_analysis:{fasta_hash}",
                time=1800,
            )

    def emit_started_event(self):
        for fasta_hash in self.sequences.keys():
            sio.emit(
                "sequence_analysis_started",
                fasta_hash,
                to=f"{self.type}_{self.socket_id}",
            )

    def emit_failed_event(self):
        for fasta_hash in self.sequences.keys():
            sio.emit(
                "sequence_analysis_response",
                {
                    "status": "error",
                    "fasta_hash": fasta_hash,
                },
                to=f"{self.type}_{self.socket_id}",
            )
