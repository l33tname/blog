---
categories:
- blog
date: 2015-04-22T00:00:00Z
description: How to proxy requests with a htaccess file
published: true
tags:
- htaccess
- proxy
- apache
- web
url: /2015/04/22/htaccess-proxy/
---

Lets say you have a web application bound to localhost. 
For example your ruby or python web project. The next logic step is to install 
nginx and setup a reverse proxy. If that's not an option and you need to use Apache 
and can not edit the Apache settings. There is a solution which I used for some time:


This assumes that your application run at port 886688. 

```
RewriteEngine On
RewriteRule ^(.*) http://localhost:886688/$1 [P]
```



Probably not the best and cleanest solution but works for me! 