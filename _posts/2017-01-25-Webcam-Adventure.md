---
published: true
description: Webcam  Adventures
categories: [blog]
tags: [Zonet ZVC7610, Network Camera, Webcam, java, python, ffplay]
layout: post
---

It has absolutely nothing to do with pr0n sadly. I build a Web dashboard with some statistics for hardware 
testing. Nothing crazy just a bit [flask](http://flask.pocoo.org/) and a bit of python magic. Anyway at some point I thought it would 
be cool to add a tab where you can see your test. Since we have IP cameras anyway. Sounds like an fairly easy task to do,
or at least I thought that. 

So my first step was to figure out what model of cameras we have and how they work. Of course you don't find a company name 
or model number in the web Interface. And the "Quick Installation Guide" is a joke. It's amazing how many pages you can fill with 
useless informations. At least on the Camera itself there is a sticker with a model number. At least something you can type in Google 
and with a bit searching it turned out that this camera is no longer for sale, but at least I found out how made it. Which is not as 
helpful as I thought because Fitivision Technology Inc. are a bit useless. But thanks to that I found a great blog post about a 
[Zonet ZVC7610 network camera](http://benstechcents.blogspot.ch/2008/04/zonet-zvc7610-network-camera-review.html) which looks almost 
identical to the one I have. The post mentions two urls `http://admin:admin@[camera IP address]/cgi/mjpg/mjpeg.cgi` and 
`http://admin:admin@[camera IP address]/cgi/jpg/image.cgi` the image url worked fine. But I didn't got the MJPG stream to 
display it just started to download a file. 

So I looked up how this M-JPEG works. Starting with the [wikipedia article](https://en.wikipedia.org/wiki/Motion_JPEG), by reading it 
I found out that it's probably M-JPEG over HTTP which sounds simple:

> In response to a GET request for a MJPEG file or stream, the server streams the sequence of JPEG frames over HTTP. A special mime-type content type multipart/x-mixed-replace;boundary=<boundary-name> informs the client to expect several parts (frames) as an answer delimited by <boundary-name>. This boundary name is expressly disclosed within the MIME-type declaration itself. The TCP connection is not closed as long as the client wants to receive new frames and the server wants to provide new frames. 

Well didn't worked for me, so the next thing I tried was to use the image url and reload it with javascript. 

``` 
<!DOCTYPE html>
<html>
  <head>
    <script>
		function updateImage() {
		    var image = document.getElementById("img");
		    image.src = image.src.split("#")[0] + "#" + new Date().getTime();
		}
		setInterval(updateImage, 800);
    </script>
  </head>
  <body>
    <img id="img" src="http://admin:admin@[camera IP address]/cgi/jpg/image.cgi#date">
  </body>
</html>
```

Which works fine. The downside of this is for each request a TCP connection get created, the images is downloaded. Which is very slow.
But cool is that it works cross browser (Firefox/Chrome) at least I thought it would. More on this topic what could go wrong later. 

My next step was to analyse how the Camera itself is able to show more FPS than my javascript solution. It's a java applet. But on the other hand 
it's really easy to find out what it does. Just download the jar file and open it with [JD-GUI](https://github.com/java-decompiler/jd-gui). For fun 
I created a swing GUI. All the code is on my bitbucket [ultracam](https://bitbucket.org/l33tname/ultracam). It helped me a lot to figure out how you 
can decode and display a M-JPG stream. Based on that research I started building a small python parser.

```
#!/usr/bin/python
# -*- coding: latin-1 -*-

import requests

url = 'http://[camera IP address]/cgi/mjpg/mjpeg.cgi'
r = requests.get(url, auth=('admin', 'admin'), stream = True)

with open("wat", 'wb') as f:
    for chunk in r.iter_content(chunk_size=600):
        if chunk: # filter out keep-alive new chunks
            f.write(chunk)

            #print(str(chunk).find("--myboundary")) # aka --myboundary .index("2d2d6d79626f756e64617279") 
            
            cl_header = int(str(chunk).find("Content-Length: "))
            cl_header = int(cl_header) + len("Content-Length: ") + 5
            print(cl_header)

            shift = 0
            foundFF = False
            foundD8 = False

            for item in str(chunk)[cl_header:cl_header+45]:
                shift += 1

                hexhex = item.encode("hex")

                if hexhex is "ff":
                    foundFF = True

                if hexhex is "d8":
                    foundD8 = True

                if foundFF and foundD8:
                    break

            print(cl_header + shift - 2)
            print(str(chunk)[0:cl_header+shift-2])

            break
```

It's not really finished but it was fun to play around and extract the jpg images from the stream.
In the process I learned that there is a tool called ffplay which worked fine with the M-JPG stream.

```
ffplay -f mjpeg -probesize 32 -i http://[camera IP address]/cgi/mjpg/mjpeg.cgi
``` 

This got me thinking why does this not work in a browser which lead me to the conclusion that I'm doing something wrong.
With a bit Google magic I found out that you can put a M-JPG stream in a img tag. 

```
<img src="http://admin:admin@[camera IP address]/cgi/mjpg/mjpeg.cgi" />
```

Well that was too easy. This works fine in Chrome / Chromium (almost). In Firefox it works for a few seconds and then the entire 
Firefox crashes, reproducible. And Chrome / Chromium doesn't send the basic auth information if the url is embedded in the [img tag](https://code.google.com/p/chromium/issues/detail?id=577705).

So for now I use the Firefox with the JavaScript image refreshing method until I figure out what the problem in Chrome is. 
In conclusion: you can waste many hours for a simple idea. 