# Overview

This repository is the Frontend Repository for community-specific information application developed as part of the Bogazici University 2024/Spring SWE 573 course project. Main repository can be reached through [this link](https://github.com/niloaydin/SWE-573-HW). All issues have been handled in the main repository with **Frontend label.**

## Technologies Used
NodeJS

React framework

Material UI

Docker
### Run the Application Locally
After cloning the repositoryto local machine, you need to check if Node js and Npm is installed in the machine.
#### If Node Js or Npm does not exist:

[This article](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) would be helpfull to install node.js and npm according to local operation system. 

#### If Node Js exists:

In order to install the dependencies, run
```
npm install
```
after the dependencies are fetched, run
```
npm start
```
This will start the React application on your local machine.


### Run the Application Using Docker
#### Prerequisities
You need to have docker installed in order to run the docker file.
#### Build Docker Image
You need to have docker installed in order to run the docker file. 

To build the Docker image, use the following command:

```bash
docker build -t community-application-frontend .
```
#### Run the Docker Container
To run the Docker container, use the following command:
```bash
docker run -p 3000:3000 community-application-frontend
