import os
from flask import Flask, render_template, request, send_file, abort
from collections import defaultdict
from os.path import exists
from Bio import SeqIO
import subprocess
import pathlib
import tempfile
import csv
import json
import shutil
from flask_cors import CORS

################################
#    Define global variables   #
################################

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# load config
config = {}
with open("config.json", "r") as config_file:
    config = json.load(config_file)

# create zipcode to city dictionary for use in /data/IMS_to_fasta
# spalten: osm_id,ags,ort,plz,landkreis,bundesland
zipcode_to_city = defaultdict(str)
zipcodes_path = "datasets/zip_codes/zuordnung_plz_ort.csv"
if exists(zipcodes_path):
    with open(zipcodes_path) as zipcodes_file:
        # skip header
        zipcodes_file.readline()
        # read content
        for line in zipcodes_file:
            line = line.strip().split(",")
            zipcode_to_city[line[3]] = line[2] + ", " + line[5]
else:
    print("ERROR: Zipcodes file not found -> will not be able to find cities")


################################
#       Main visual pages      #
################################

# all of these just render the corresponding template and return the hmtl


@app.route("/", methods=["GET"])
def main_view():
    return render_template("main_view.html")


@app.route("/data", methods=["GET"])
def data_view():
    return render_template("data.html")


@app.route("/choose_data", methods=["GET"])
def choose_data_view():
    return render_template("choose_data.html")


@app.route("/export", methods=["GET"])
def export_view():
    return render_template("export.html")


# @app.route("/similar_cases",methods=["GET"])
# def similar_cases_view():
#     return render_template("similar_cases.html")


@app.route("/help", methods=["GET"])
def help_view():
    return render_template("help.html")


@app.route("/contact", methods=["GET"])
def contact_view():
    return render_template("contact.html")


@app.route("/test", methods=["GET"])
def test_view():
    # return a test json
    return json.dumps({"test": "test"})


################################
#        data downloads        #
################################


# sends the example dataset downloadable from /choose_data
@app.route("/example_datasets/<file>", methods=["GET"])
def send_example_dataset(file):
    if file in ["example_dataset.json", "empty_dataset.json"]:
        try:
            return send_file("datasets/example_datasets/" + file)
        except FileNotFoundError:
            abort(404)
    else:
        return abort(404)


# sends example files for different upload functions
@app.route("/example_files/<file>", methods=["GET"])
def send_example_files(file):
    if file in [
        "example_sequence_background.tsv",
        "example_sequence_outbreak.fa",
        "example_sequence_outbreak.tsv",
    ]:
        try:
            return send_file("datasets/example_files/" + file)
        except FileNotFoundError:
            abort(404)
    else:
        return abort(404)


################################
#       Funcional routes       #
################################


# Process: calls script to run fasta with nextclade
# Input: fasta of one or multiple sequences in json dict with key "fasta_content"
# Returns: output json from nexclade
@app.route("/data/nextclade", methods=["POST"])
def nextclade():
    fasta_content = request.get_json(force=True)["fasta_content"]
    # create directory if not existent
    temp_dir = "./temp_data/nextclade/"
    pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

    # Create temporary file names
    fa_tmp = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=".fa", delete=False).name
    json_tmp = fa_tmp[:-2] + "json"

    # save fasta in temp file
    with open(fa_tmp, "w") as fa_file:
        fa_file.write(fasta_content)

    # Prepare the nextclade command with arguments
    command = [
        "nextclade",
        "run",
        fa_tmp,  # Input fasta file
        "--output-json",
        json_tmp,  # Output JSON file
        "--input-dataset",
        "datasets/nextclade_covid",  # Dataset directory
    ]

    # Run the nextclade command
    process = subprocess.run(command, capture_output=True, text=True)

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
            content = json.load(json_file)

        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(json_tmp).unlink(missing_ok=True)

        # finally return output in json format
        return json.dumps(content)
        # return json.dumps({"header":header, "content":content})


# Process: calls samtools to search for corresponding fastas in RKI download (+ metadata from csv)
# Input: IMS-ID of one or multiple sequences
# Returns: dictionary containing ims ids with values of sequence and other metadata
@app.route("/data/IMS_to_fasta", methods=["POST"])
def IMS_to_fasta():
    ids = request.get_json(force=True)["IMS-IDs"]

    # return empty if none were sent
    if ids == []:
        return json.dumps({})

    # create directory if not existent
    temp_dir = "./temp_data/samtools/"
    pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

    # Create temporary file names
    fa_tmp = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=".fa", delete=False).name
    csv_tmp = fa_tmp[:-2] + "csv"

    # call process
    process = subprocess.run(
        [
            "./scripts/IMS_to_fasta.sh",
            " ".join(ids),
            fa_tmp,
            "|".join(ids),
            csv_tmp,
            config["RKI_data_directory"],
        ]
    )

    # return a None if the process failed (may change this in future)
    if process.returncode != 0:
        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(csv_tmp).unlink(missing_ok=True)

        print("SAMTOOLS FAILED", process)
        return "failed process"

    # if the process succeded return output
    else:
        # collect output data into dict
        imsid_to_seq = {}
        imsid_to_data = {}

        # collect sequences
        fasta_sequences = SeqIO.parse(open(fa_tmp), "fasta")
        for fasta in fasta_sequences:
            imsid_to_seq[fasta.id] = str(fasta.seq)

        # collect metadata
        with open(csv_tmp, "r") as csv_file:
            for line in csv_file:
                line = line.strip().split(",")

                imsid_to_data[line[0]] = {
                    "sequence": imsid_to_seq[line[0]],
                    "sampling_date": line[1],  # when sampled   YYYY-MM-DD
                    "seq_type": line[2],
                    "seq_reason": line[3],
                    "sample_type": line[4],
                    # "own_fasta_id" : line[5], # is encrypted. we just use imsid as fasta id
                    "receive_date": line[6],  # when send to rki
                    # "processing_date" : line[7],
                    "sequencing_lab_zipcode": line[8],  # zip code of sequencing lab
                    "sequencing_lab_city": zipcode_to_city[line[8]],
                    "sending_lab_zipcode": line[9],
                    "sending_lab_city": zipcode_to_city[line[9]],
                    # "gisaid_id" : line[10]
                }

        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(csv_tmp).unlink(missing_ok=True)

        # finally return output in json format
        return json.dumps(imsid_to_data)


# Disclaimer: this is not finished yet


# Process: calls script to sort sample into UShER tree and search for k nearest samples
# Input: fasta of one sequence and integer k in json dict
# Returns: List of IMS-IDS of the k nearest samples
@app.route("/data/usher_nearest_k", methods=["POST"])
def usher_nearest_k():

    fasta_content = request.get_json(force=True)["fasta_content"]
    fasta_content2 = fasta_content.replace(">", ">querry_")

    k = request.get_json(force=True)["k"]

    # create directory if not existent
    temp_dir = "./temp_data/usher/"
    pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

    # Create temporary file names
    out_tmp = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=".fa", delete=False).name
    tmp0 = out_tmp[:-3] + "_0.fa"
    dir_tmp = out_tmp[:-3] + "/"
    csv_tmp = out_tmp[:-3] + ".csv"
    fa_tmp = tempfile.NamedTemporaryFile(
        dir=temp_dir, suffix=".closest.fa", delete=False
    ).name
    # Define   stderr
    new_stderr = open("./temp_data/usher/test.stderr", "w")
    new_stdout = open("./temp_data/usher/test.stdout", "w")

    # save fasta in temp file
    with open(tmp0, "w") as tmp0_file:
        tmp0_file.write(fasta_content2)

    # call process
    process = subprocess.run(
        [
            "./scripts/usher_nearest_k.sh",
            tmp0,
            k,
            out_tmp,
            dir_tmp,
            csv_tmp,
            config["RKI_data_directory"],
            fa_tmp,
        ],
        stdout=new_stderr,
        stderr=new_stdout,
    )

    # return a None if the process failed (may change this in future)
    if process.returncode != 0:
        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(out_tmp).unlink(missing_ok=True)

        print("SCRIPT FAILED", process)
        return "failed process"

    # if the process succeded
    else:

        imsid_to_data = {}
        with open(csv_tmp, "r") as csv_file:
            for line in csv_file:
                line = line.strip().split(",")

                imsid_to_data[line[0]] = {
                    "sampling_date": line[1],  # when sampled   YYYY-MM-DD
                    "sending_lab_city": zipcode_to_city[line[9]],
                }

        # delete the temporary files. If they can not be found ignore it
        pathlib.Path(csv_tmp).unlink(missing_ok=True)
        pathlib.Path(fa_tmp).unlink(missing_ok=True)
        pathlib.Path(out_tmp).unlink(missing_ok=True)
        pathlib.Path(tmp0).unlink(missing_ok=True)
        pathlib.Path(tmp0 + ".aligned").unlink(missing_ok=True)
        pathlib.Path(tmp0 + ".aligned.vcf").unlink(missing_ok=True)
        shutil.rmtree(dir_tmp)

        IDs = []
        loc = []
        date = []

        for x in imsid_to_data:
            IDs.append(x)
            loc.append(imsid_to_data[x]["sending_lab_city"])
            date.append(imsid_to_data[x]["sampling_date"])

        IMS_list_out = {"IMS_ID": IDs, "loc": loc, "Seqdate": date}

        # finally return output in json format
        return json.dumps([IMS_list_out])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
