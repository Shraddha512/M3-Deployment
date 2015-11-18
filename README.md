Milestone 3 - Deployment
===========

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



####The ability to determine failure or success of a build job post-build trigger

We are sending a mail on every failure of our Release job.

####Multiple jobs corresponding to multiple branches in a repository.

![](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.13.39%20PM.png)

We have two jobs corresponding to two different branchest of our repository(master and dev)

####History of past builds

![Jenkins build history page to track logs](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.18.34%20PM.png)


<h3>Screencast </h3>

<i>Click here to watch the screencast </i>
[![Click here to watch the screencast] (http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://youtu.be/4CTNIQw-mHg)
