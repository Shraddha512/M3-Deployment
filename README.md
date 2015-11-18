Milestone 3 - Deployment
===========


**Team Members :**

1. Ankit Agrawal (aagrawa5)
2. Apoorv Mahajan (amahaja3)
3. Shraddha Naik (sanaik2)

### Application

We are creating a Bucket List web application using Python flask framework and sqllite3 as the database.

![](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.26.07%20PM.png)

### Earlier steps

We are using Jenkins for continous integration, Pylint for test and analysis.


### Properties
---

####Configuration Management

We are using Ansible to automatically configure our production environment.

####Deployment to production environment

This is included in a file launch.sh. We run this script through our Jenkins shell

We are using AWS Code Deploy and S3 buckets for this step. We deploy our code on Amazon Linux instance.

Steps1: We have two Jenkins jobs: 
1. PythonM1Build which builds the production branch and deploys the code to two instances.
2. CanaryRelease which builds the dev branch and deploys on subset of the two instances.(one instance).

![Jenkins jobs](https://github.com/Shraddha512/M3-Deployment/blob/master/images/jenkins%20jobs.png)

Step2: Jenkins uses AWS Code Deploy plugin to zip the latest pushed code and send it to S3 bucket.

![Console output of Jenkins job](https://github.com/Shraddha512/M3-Deployment/blob/master/images/zipping%20console.png)

Step3: S3 bucket "milestone3shraddha" holds the various versions of code pushed by jenkins job.

![S3 bucket](https://github.com/Shraddha512/M3-Deployment/blob/master/images/s3bucket.png)

Step4: AWS Code Deploy pulls the latest code from S3 bucket and deploys it. We have two Groups:
1. ProdDeploy : Deploys to two instances.
2. Canary : Deploys to one of the two instances. 

![AWS Code Deploy](https://github.com/Shraddha512/M3-Deployment/blob/master/images/deploymentapp.png)

The following are the steps during deployment:

![AWS Code Deploy Events](https://github.com/Shraddha512/M3-Deployment/blob/master/images/deployevents.png)

####Feature Flags

We are adding setting a flag on redis-cli which will change the font color of our deployed application.

![Font Color changed](https://github.com/Shraddha512/M3-Deployment/blob/master/images/redis.png)

####Monitoring

We are performing monitoring on our instances based on two metrics : CPU usage and Memory usage: 

The file for the code of monitoring [main.js](https://github.com/Shraddha512/M3-Deployment/blob/master/main.js).


![Output](https://github.com/Shraddha512/M3-Deployment/blob/master/images/Screen%20Shot%202015-11-17%20at%2010.20.08%20PM.png)


####Canary Release.




<h3>Screencast </h3>

<i>Click here to watch the screencast </i>
[![Click here to watch the screencast] (http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://youtu.be/4CTNIQw-mHg)
