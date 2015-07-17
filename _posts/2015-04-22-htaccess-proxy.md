---
published: true
description: How to proxy requests with a htaccess file
categories: [blog]
tags: [htaccess, proxy, apache, web]
layout: post
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