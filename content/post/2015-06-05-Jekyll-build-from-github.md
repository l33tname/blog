+++
date = "2015-06-05T00:00:00Z"
title = "Jekyll build from github"
description = "Jekyll build from Github"
tags = ["automatic deployment", "github", "git", "blog", "FreeBSD"]
url = "/2015/06/05/jekyll-build-from-github/"

+++

You might or might not remember how I publish this blog with Github. But I wrote a [post][1] about this.
Since I migrated my hosting to a VPS I changed a few things.
The important bits that changed are, the way things get logged. Now I use `tee` which has the side effect that 
the output is on my logfiles and get printed to stdout which you can see then on you php update page (this helps to debug the build process). 
The other thing that changed is that on FreeBSD jekyll is installed in /usr/local/bin, which is not in the default path. This 
resulted in a blog which get no updates, because the jekyll binary is missing. That's why I added /usr/local/bin to the path, to fix this. 


```
$ cat update.php
<?php
	$output = shell_exec('./update.sh');
	echo "<pre>$output</pre>"; 
?>
```

```
$ cat update.sh
#!/bin/sh
export PATH=$PATH:/usr/local/bin

#the logfile
datestr=$(date +%Y%m%d_%H%M%S)
LOGFILE=/usr/local/www/update_log/log_$datestr

#cd to your git repo
cd /usr/local/www/blog_git_src

#update ALL TEH SOURCE
echo git | tee -a $LOGFILE
git version | tee -a $LOGFILE
git pull origin master | tee -a $LOGFILE

#build page
echo jekyll | tee -a $LOGFILE
jekyll build -d /usr/local/www/blog | tee -a $LOGFILE
```


  [1]: /blog/2013/11/24/Publish-with-Github
