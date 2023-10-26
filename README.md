# Demo
 Test:
 
 username: Brad
 
 password: 1234

 "frontend" : "http://brad_ricebook.surge.sh"
 
 "backend" : ec2-52-90-242-168.compute-1.amazonaws.com
 
 Language: JavaScript
 
 Framework: Express.js

# Deploy Nodejs application to AWS EC2 using Github Actions

## Steps:

- Write docker file

    - Pull nodejs images from docker hub
       `FROM node:18-slim`
       
    - Copy package.json
       `COPY package.json /app `
 
    - Copy all files to images
       `COPY . /app`
       
    - Expose port of this images
       `EXPOSE 4000`
       
    - Run nodejs app
       `CMD ["npm", "start"]`
        
- Write yaml file for github actions

  - Set what branch to run actions when there is a push
 
  - Write jobs - in these section only build and deploy
     - Build
         runs-on: what os to run these command
         steps:
           - Login to docker hub
               set your username and password in repo/settings/secret
           - Build docker image
           - Publish image to docker hub (default public images on docker hub)
       
     - Deploy
 
- Set runners on your repo

  from repo/settings/actions/runner

  choose image and architecture, then run codes on your machine, here we are going to run commands on AWS EC2 instance

- Launch EC2 instance

    - Launch EC2
      - Select Ubuntu AMI
      - Set secruity group and the inbound port which is same with port in docker file
      
    - Write User data
      Take a look at ec2-user-data.txt file
      
    - run runners commands on EC2 instance
      
reference: 
- [Steps for deploying Nodejs Applications](https://www.youtube.com/watch?v=OeLnEB9FDpw&t=587s)
- [Install docker on ubuntu](https://phoenixnap.com/kb/install-docker-on-ubuntu-20-04)
