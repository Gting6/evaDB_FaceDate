# evaDB_FaceDate
**Name: Chi-Ting Liu, GTID: 903925209**

## Introduction

It's a common observation that couples often resemble each other. This phenomenon sparks discussions about our inclination to be drawn to those who share similarities with us. Research studies delve into this intriguing aspect of attraction. Consequently, I **build a dating app that suggests potential matches based on similarities**.

In my [last project](https://github.com/Gting6/evaDB_AWS_Rekognition), I integrated evaDB with AWS Rekognition services, augmenting this database with robust computer vision capabilities. The seamless SQL interface of evaDB coupled with image search capabilities from AWS Rekognition sets the ideal foundation for constructing this dating app.

To achieve this, I explore the REST API of evaDB. I chose React for the frontend framework, Flask for the backend, and leveraged evaDB as the core database to develop the prototype of FaceDate—a dating app centered around identifying similarities.

## Setup Locally
- Client
  - `brew install yarn`
  - `cd facedateclient/`
  - `yarn add @mui/material @emotion/react @emotion/styled`
  - `yarn`
  - `yarn start`
  - Then it will set up a client on `localhost:3000`
- Server
  - Install evadb first: `git clone git@github.com:georgia-tech-db/evadb.git`
  - `cd evadb`
  - `python -m venv evadb-venv`
  - `source evadb-venv/bin/activate`
  - `cd evadb/apps/rest`
  -  Put files "facedateserver/*" into `evadb/apps/rest` folder
  - `mkdir files/`
  - `pip3 install -r requirements.txt`
  - `python3 faceDateServer.py`
  - Then it will set up a server on `localhost:8803`

## Big Picture
<img width="574" alt="Screenshot 2023-11-25 at 4 11 21 PM" src="https://github.com/Gting6/evaDB_FaceDate/assets/46078333/abf525c0-f914-4555-9498-bd571767f16f">

When users visit our app, they will first be asked to register. Then we will store their pictures into our database. After registration, he/she can click the find mate button, then the front-end will render two results in database that looks most similar to them.

## Sample Input / Output
For this demo, let's assume our database already contains profiles of 4 individuals. I'll illustrate the process of a new user registering and finding a potential match.”
At first, the database has the following information:
<img width="640" alt="Screenshot 2023-11-25 at 4 12 43 PM" src="https://github.com/Gting6/evaDB_FaceDate/assets/46078333/a61528d7-791a-4cc6-a926-08bebd25d864">

Then, I (Liu) register through the registration page:
<img width="746" alt="Screenshot 2023-11-25 at 4 13 26 PM" src="https://github.com/Gting6/evaDB_FaceDate/assets/46078333/e1daced3-10df-401b-93ec-e1de2887ada3">

After registration, I can see the “Find My Mate” button as following:

<img width="397" alt="Screenshot 2023-11-25 at 4 14 22 PM" src="https://github.com/Gting6/evaDB_FaceDate/assets/46078333/d5b807c3-37b9-4624-9605-8e6da4c51340">

Click on the button, then I can see the top 2 result!

<img width="281" alt="Screenshot 2023-11-25 at 4 15 06 PM" src="https://github.com/Gting6/evaDB_FaceDate/assets/46078333/84c25a54-410b-4aa7-bbf9-c30e18fdac7f">
