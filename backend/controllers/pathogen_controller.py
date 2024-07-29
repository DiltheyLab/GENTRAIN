from flask import request, json, Blueprint
import subprocess
import pathlib
import tempfile
import json
from flask_pydantic import validate
from .requests.get_sequence_variants import (
    SequenceVariantsResponseModel,
    SequenceVariantsRequestBodyModel,
)
from pydantic import BaseModel
import re

# user controller blueprint to be registered with api blueprint
pathogens = Blueprint("pathogens", __name__)


# error response model
class ErrorResponseModel(BaseModel):
    message: str


# custom validators
def find_genomic_validation_errors(value: str):
    illegal_characters = re.findall("[^ATGCRYSWKMBDHVNXU]+", value)
    return illegal_characters


@pathogens.route("/<pathogen_id>/sequences/<fasta_id>/variants", methods=["POST"])
@validate()
def get_sequence_variants(
    body: SequenceVariantsRequestBodyModel, pathogen_id: str, fasta_id: str
):
    genomic_errors = find_genomic_validation_errors(body.sequence)
    if genomic_errors and len(genomic_errors) > 0:
        return (
            ErrorResponseModel(
                message="Genomic sequence does not contain valid structure."
            ),
            422,
        )

    # create directory if not existent
    temp_dir = "./temp_data/nextclade/"
    pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

    # Create a temporary file that is read by the bash script and a json file in which the response will be written
    # tempfile generates names of random characters allowing those files to be securely created in shared temporary directories
    fa_tmp = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=".fa", delete=False).name
    json_tmp = fa_tmp[:-2] + "json"

    # Save fasta string (ids, sequences) in temp file
    # TODO: validate sequence (ATCG...)
    with open(fa_tmp, "w") as fa_file:
        fa_file.write(f">{fasta_id}\n{body.sequence}")

    # Execure script to retrieve variants based on pathogen
    process = subprocess.run(
        [f"./scripts/pathogens/{pathogen_id}.sh", fa_tmp, json_tmp]
    )

    # return a None if the process failed (may change this in future)
    if process.returncode != 0:
        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(json_tmp).unlink(missing_ok=True)

        print("SCRIPT FAILED", process)
        return "failed process"

    # if the process succeded
    else:
        # collect output data into lists
        with open(json_tmp, "r") as json_file:
            # check for script errors
            content = json.load(json_file)
            if content["errors"] and len(content["errors"]) > 0:
                return (
                    ErrorResponseModel(
                        message="Genomic sequence does not contain valid structure."
                    ),
                    422,
                )

            content = content["results"][0]

        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(json_tmp).unlink(missing_ok=True)

        # finally return output as pydantic response model in json format
        return SequenceVariantsResponseModel(
            lineage=f"{content['clade']}, {content['customNodeAttributes']['Nextclade_pango']}",
            n_count=content["totalMissing"],
            substitutions=content["substitutions"],
            deletions=content["deletions"],
            insertions=content["insertions"],
            missing=content["missing"],
            nonACGTNs=content["nonACGTNs"],
            alignmentStart=content["alignmentStart"],
            alignmentEnd=content["alignmentEnd"],
        )
