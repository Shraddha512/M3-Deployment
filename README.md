Milestone 1
===========

### Application

We are creating a Bucket List web application using Python flask framework and sqllite3 as the database.

![](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.26.07%20PM.png)

### Build Section

---

**Trigger a build**

We are using webhooks to trigger a build in Jenkins after every commit to the repository.

**Script to ensure clean build**

This is included in a file launch.sh. We run this script through our Jenkins shell

```
virtualenv env
source env/bin/activate
pip install flask
python -m py_compile app.py

```

-	This sets up the environment.
-	Installs dependencies.
-	Compiles the code

**The ability to determine failure or success of a build job post-build trigger**

We are sending a mail on every failure of our Release job.

**Multiple jobs corresponding to multiple branches in a repository.**

![](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.13.39%20PM.png)

We have two jobs corresponding to two different branchest of our repository(master and dev)

**History of past builds**

![Jenkins build history page to track logs](https://github.com/Shraddha512/MS1/blob/master/images/Screen%20Shot%202015-10-01%20at%2010.18.34%20PM.png)


<h3>Screencast </h3>

<i>Click here to watch the screencast </i>
[![Click here to watch the screencast] (http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://youtu.be/4CTNIQw-mHg)
