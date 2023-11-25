# coding=utf-8
# Copyright 2018-2023 EvaDB
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os
from pathlib import Path

from flask import Flask, flash, redirect, request
from flask_restful import Api
from flask_cors import CORS
from werkzeug.utils import secure_filename

import json
import evadb

cursor = evadb.connect().cursor()
cwd = os.getcwd()
UPLOAD_FOLDER = cwd + "/files"
ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif", "mp3"}

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
api = Api(app)
app.secret_key = "evadb-rest-apis"


usersData = {}


@app.route("/register", methods=["POST"])
def registration():
    name = request.form["name"]
    mail = request.form["mail"]
    if request.method == "POST":
        if "file" not in request.files:
            flash("No file detected")
            return redirect(request.url)
        file = request.files["file"]
        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            path = Path(UPLOAD_FOLDER + "/" + filename)
            if path.is_file():
                flash("File uploaded")
            else:
                flash("Failed to upload file")
                return redirect(request.url)

    print(1)
    # cursor.query("DROP TABLE IF EXISTS imageDemo").df()

    print(2, filename)
    cursor.query("LOAD IMAGE './files/" + filename + "' INTO imageDemo").df()
    print(3)

    # cursor.query("DROP TABLE IF EXISTS userDemo").df()
    print(4)
    cursor.query(
        "CREATE TABLE IF NOT EXISTS userDemo ( \
            name TEXT, \
            gmail TEXT, \
            filename TEXT\
        );"
    ).df()
    print(5)

    cursor.query(
        "INSERT INTO userDemo (name, gmail, filename) VALUES ( '"
        + name
        + "', '"
        + mail
        + "', 'files/"
        + filename
        + "');"
    ).df()
    print(6)

    q = cursor.query("SELECT * FROM userDemo;")
    print(7, q.df())
    return {"response": "File saved"}


@app.route("/mate", methods=["POST"])
def query_mate():
    cursor.query(
        """
        CREATE FUNCTION IF NOT EXISTS AWSCompareFaces
        IMPL 'awsCompareFaces.py';
        """
    ).df()

    print(1)
    filename = "files/" + request.form["filename"]
    print(2)

    r = cursor.query(
        f"""
        SELECT i.data, u.gmail, u.name
        FROM userDemo AS u
        JOIN (
            SELECT name, data, AWSCompareFaces(data, Open(\'{filename}\'))
            FROM imageDemo
            WHERE name != \'{filename}\'
            ORDER BY similarity DESC
            LIMIT 2
        ) as i
        ON u.filename=i.name;
        """
    ).df()
    # WHERE name != 'files/Penny.png'

    print(3)
    print(r)
    print(4)
    return {"response": r.to_json()}


# Get Query response
@app.route("/query", methods=["POST", "GET"])
def query_from_db():
    print(1)
    cursor.query("DROP TABLE IF EXISTS groceryDemo").df()
    print(2)
    cursor.query("LOAD IMAGE 'IMG_3452.jpg' INTO groceryDemo").df()
    print(3, ":")
    data = json.loads(request.get_data().decode("utf-8"))
    print(data)
    if request.method == "POST":
        query = data["query"]
        res = cursor.query(query).df()
        # print(res.to_json())
        # return {"api response": "hi"}
        return {"api response": res.to_json()}
    print(4)
    return """<html>
                <body>
                    <form method="POST"
                        enctype = "multipart/form-data">
                        <input type = "input" name = "query" placeholder="Enter query"/>
                        <input type = "submit"/>
                    </form>
                </body>
            </html>"""


# Upload file to server
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            flash("No file detected")
            return redirect(request.url)
        file = request.files["file"]
        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            path = Path(UPLOAD_FOLDER + "/" + filename)
            if path.is_file():
                flash("File uploaded")
                return {"response": "File saved"}
            else:
                flash("Failed to upload file")
                return redirect(request.url)
    return """<html>
                <body>
                    <form method="POST"
                        enctype = "multipart/form-data">
                        <input type = "file" name = "file" />
                        <input type = "submit"/>
                    </form>
                </body>
            </html>"""


if __name__ == "__main__":
    app.run(debug=True, port=8803)
