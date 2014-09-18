---
published: true
description: Allow raw sockets on a per jail basis
categories: [blog]
tags: [FreeBSD, ezjail, raw sockets]
layout: post
---

This is more a note for me than a blog post. I struggle a bit with allowing raw sockets on a per jail basis.
But if you know how it's done, it's not really hard. At least not with ezjail where you have a per jail config file.
Let's say you need raw sockets in a jail named 'examplejail' you just need to add:


> export jail\_examplejail\_parameters="allow.raw\_sockets=1"


to the config file which you find under `/usr/local/etc/ezjail/examplejail`.

Restart ezjail and \o/ you have access from your examplejail to the raw sockets.
