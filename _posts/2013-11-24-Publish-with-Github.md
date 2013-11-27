---
description: This blog get published by github
published: true
categories: [blog]
tags: [automatic deployment, github, git, blog]
layout: post
---
#Deploy with Github

If everything works as intended you can send push requests to our [github repo](https://github.com/l33tsource/blog) and it'll get automagic deployed if we merge it.
 
Publishing from github is easy. You just need to set a small php page up which invokes a script to update the git repo and add the url of your php script in "web hooks" at github.
 
The php file:
<pre>
$ cat update.php  
<?php  
	shell_exec('./update.sh');  
?>   
</pre>
 
and the update script:
<pre>
$ cat update.sh 
#!/bin/sh
#the logfile
datestr=$(date +%Y%m%d_%H%M%S)
LOGFILE=/your/path/log_$datestr

#cd to your git repo
cd /home/username/blog/

#update ALL TEH SOURCE
echo git >> $LOGFILE
git pull >> $LOGFILE

#Load bash_profile for jekyll
. /home/username/.bash_profile

#build page
echo jekyll >> $LOGFILE
jekyll build -d /var/www/virtual/username/html >> $LOGFILE
</pre>
 
This replace the [post-receive git hook]({% post_url 2013-5-15-jekyll-1.0 %}). And will do the same work.
