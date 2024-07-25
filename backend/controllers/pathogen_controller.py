from flask import request, json, Blueprint
import subprocess
import pathlib
import tempfile
import json
from flask_pydantic import validate
from pydantic import BaseModel

# user controller blueprint to be registered with api blueprint
pathogens = Blueprint("pathogens", __name__)


class GetSequenceVariantsRequestBodyModel(BaseModel):
    sequence: str


class GetSequenceVariantsResponseModel(BaseModel):
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentStart: int
    alignmentEnd: int


@pathogens.route("/<pathogen_id>/sequences/<fasta_id>/variants", methods=["POST"])
@validate()
def getSequenceVariants(
    body: GetSequenceVariantsRequestBodyModel, pathogen_id: str, fasta_id: str
):
    # create directory if not existent
    temp_dir = "./temp_data/nextclade/"
    pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

    # Create a temporary file that is read by the bash script and a json file in which the response will be written
    # tempfile generates names of random characters allowing those files to be securely created in shared temporary directories
    fa_tmp = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=".fa", delete=False).name
    json_tmp = fa_tmp[:-2] + "json"

    # Save fasta string (ids, sequences) in temp file
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
            content = json.load(json_file)["results"][0]

        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(json_tmp).unlink(missing_ok=True)

        # finally return output in json format
        return GetSequenceVariantsResponseModel(
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
