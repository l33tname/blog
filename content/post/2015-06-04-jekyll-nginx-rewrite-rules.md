+++
date = "2015-06-04T00:00:00Z"
title = "jekyll nginx rewrite rules"
description = "Clean URLs with nginx and jekyll"
tags = ["jekyll", "proxy", "nginx", "web", "redirect"]
url = "/2015/06/04/jekyll-nginx-rewrite-rules/"

+++

I use `permalink: pretty` which create for each post a folder with a index.html. 
This creates nice urls like this /2015/04/22/htaccess-proxy. But last time I checked my
error logs I saw a few peoples who tried urls like this: /2015/04/22/htaccess-proxy.html.
So I thought why not redirect this urls. Of course I'm not the first person with this problem, 
I found two blog post on which I based my solution. 

- [vec.io/posts/jekyll-clean-urls-with-nginx][1]
- [rickharrison.me/how-to-remove-trailing-slashes-from-jekyll-urls-using-nginx][2]

My solution:

```
server {
        listen       80;
        server_name  l33tsource.com www.l33tsource.com;

        rewrite ^/index.html$ / redirect;
        rewrite ^(/.+)/index.html$ $1 redirect;
    
        if ($request_uri ~* ".html") {
            rewrite (?i)^(.*)/(.*)\.html $1/$2 redirect;
        }

        location / {
            rewrite ^/(.*) /$1 break;
            proxy_pass http://blog;
        }
}
```

If you have any problems or find broken urls, just write me. 

###Update

For some weird reason all these redirection foo doesn't work when the blog upstream not on port 80 is. 

  [1]: https://vec.io/posts/jekyll-clean-urls-with-nginx
  [2]: http://rickharrison.me/how-to-remove-trailing-slashes-from-jekyll-urls-using-nginx
