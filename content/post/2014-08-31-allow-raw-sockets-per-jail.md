+++
date = "2014-08-31T00:00:00Z"
title = "raw sockets in jails"
description = "Allow raw sockets on a per jail basis"
tags = ["FreeBSD", "ezjail", "raw sockets"]
url = "/2014/08/31/allow-raw-sockets-per-jail/"

+++

This is more a note for me than a blog post. I struggle a bit with allowing raw sockets on a per jail basis.
But if you know how it's done, it's not really hard. At least not with ezjail where you have a per jail config file.
Let's say you need raw sockets in a jail named 'examplejail' you just need to add:


> export jail\_examplejail\_parameters="allow.raw\_sockets=1"


to the config file which you find under `/usr/local/etc/ezjail/examplejail`.

Restart ezjail and \o/ you have access from your examplejail to the raw sockets.
