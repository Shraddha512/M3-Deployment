Milestone 3 - Deployment
===========


**Team Members :**

1. Ankit Agrawal (aagrawa5)
2. Apoorv Mahajan (amahaja3)
3. Shraddha Naik (sanaik2)

### Application

We are creating a Bucket List web application using Python flask framework and sqllite3 as the database.

![](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.26.07%20PM.png)


We are using Jenkins for continous integration.

### Properties
---

####Task 1: Configuration Management
We are using [Ansible](http://docs.ansible.com/ansible/intro.html) to automatically configure our production environment.

The provisioning is done on Amazon EC2 Linux instances. The playbook used for the provisioning can be accessed from [here.](https://github.com/Shraddha512/M3-Deployment/blob/master/playbook.yml)

The playbook provisions the following components:
* Git
* Redis
* gcc compiler
* make and tar utilities
* Sqlite 3 database
* Python and its packages.
* Nodejs

#### Task 2: Deployment to Production Environment

The Build steps and the Testing and Analysis steps are performed first.

<h4>Build</h4>
A Jenkins job (mentioned below in this section) is triggered on committing to the GitHub repository.

<h4>Testing and Analysis</h4>
* The python package nose is the unit-testing framework used. It generates reports in a format which the [Cobertura](https://wiki.jenkins-ci.org/display/JENKINS/Cobertura+Plugin) plugin understands and this plugin is used to display the results in a graphical format.
* The pylint package is used for static code analysis. The results generated by this plugin is displayed using the 
 [Violations](https://wiki.jenkins-ci.org/display/JENKINS/Violations) Jenkins plugin.

Once these steps are successfully completed, the Deployment phase begins.

<h4>Deployment</h4>

* The steps for Deployment are included in a file named [launch.sh](https://github.com/Shraddha512/M3-Deployment/blob/master/launch.sh). We run this script through our Jenkins shell.

* We are using [AWS Code Deploy](https://aws.amazon.com/codedeploy/) and [Amazon S3](https://aws.amazon.com/s3/) buckets for this step. We deploy our code on [Amazon EC2](https://aws.amazon.com/ec2/) Linux instances.

Step1: We have two Jenkins jobs: 
1. PythonM1Build which builds the production branch and deploys the code to two instances.
2. CanaryRelease which builds the dev branch and deploys on subset of the two instances (one instance).
![Jenkins jobs](https://github.com/Shraddha512/M3-Deployment/blob/master/images/jenkins%20jobs.png)

Step2: Jenkins uses [AWS Code Deploy plugin](https://github.com/awslabs/aws-codedeploy-plugin) to zip the latest pushed code and send it to the S3 bucket.

![Console output of Jenkins job](https://github.com/Shraddha512/M3-Deployment/blob/master/images/zipping%20console.png)

Step3: S3 bucket "milestone3shraddha" holds the various versions of code pushed by jenkins job.

![S3 bucket](https://github.com/Shraddha512/M3-Deployment/blob/master/images/s3bucket.png)

Step4: AWS Code Deploy pulls the latest code from S3 bucket and deploys it. We have two Groups:
1. ProdDeploy : Deploys to two instances.
2. Canary : Deploys to one of the two instances. 

![AWS Code Deploy](https://github.com/Shraddha512/M3-Deployment/blob/master/images/deploymentapp.png)

The following are the steps during deployment:

![AWS Code Deploy Events](https://github.com/Shraddha512/M3-Deployment/blob/master/images/deployevents.png)

#### Task 3:Feature Flags
* To enable the usage of Feature Flags, we use [Redis](http://redis.io/) as the in-memory database store.
* The deployed application has the following feature which can be toggled on/off:
  * Setting the flag on redis-cli will change the font color of our deployed application as shown below:
![Font Color changed](https://github.com/Shraddha512/M3-Deployment/blob/master/images/redis.png)

  * Unsetting the flag on redis-cli will change the font color of our deployed application to the one shown below:
![Feature flag toggled off](https://cloud.githubusercontent.com/assets/9305577/11252538/b3db2bf8-8e04-11e5-9366-a8b56416cbc7.png)

#### Task 4:Monitoring

We are performing monitoring on our instances based on two metrics : CPU usage and Memory usage: 

The file for the code of monitoring is present [here.](https://github.com/Shraddha512/M3-Deployment/blob/master/main.js).

![Output](https://github.com/Shraddha512/M3-Deployment/blob/master/images/Screen%20Shot%202015-11-17%20at%2010.20.08%20PM.png)

An alert is sent as soon as the threshold values specified for the metrics are exceeded.
![servicealert](https://cloud.githubusercontent.com/assets/9305577/11252646/41d3ec6a-8e05-11e5-921c-8da94f98b476.png)


#### Task 5: Canary Release
*(Please note that the proxy server logs are visible in the bottom right, and canary server in the top right in the following screenshots)*

The proxy server redirects 70% of the requests to the main server.
![Redirect to main server](https://cloud.githubusercontent.com/assets/3266051/11253002/1f7d503c-8e07-11e5-9a65-0c246f75a796.png)

30% of the requests (chosen randomly) are redirected by the proxy to the canary deployment.
![Redirect to canary](https://cloud.githubusercontent.com/assets/3266051/11253057/66fce350-8e07-11e5-964a-cc24d510260c.png)

If an alert is raised by the server running the canary deployment, the proxy redirects all subsequent requests to the main server.
![Redirect after alert](https://cloud.githubusercontent.com/assets/3266051/11253081/7e8b7cb6-8e07-11e5-875f-8bf6d182073b.png)



<h3>Screencast </h3>
 <i>Click here to watch the screencast </i>
[![Click here to watch the screencast] (http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=drVdHQMedyI)
