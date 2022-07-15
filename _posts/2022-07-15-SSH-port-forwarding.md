---
published: true
description: SSH port forwarding trough jump host
categories: [blog]
tags: [ssh, linux, port forwarding, jump host, network]
layout: post
---


This is a short blog post explaining how to 
forward a port trough a jump host.
I needed this to access a web UI which was only accessible via a jump host.

Here is the situation:

+---------------+   +---------------------+    +----------------------------+
|               |   |                     |    |                            |
| You (Host A)  +-->| Jump Host (Host B)  +--->| Target Host (Host C)       |
|               |   |                     |    | Web interface on port 443  |
+---------------+   +---------------------+    +----------------------------+


To make it convenient we add most of the config into `.ssh/config`

```
Host HostB

Host HostC
  ProxyJump HostB
```

In reality you usually have some key and hostnames to configure:

```
Host HostB
  User userb
  Hostname 192.168.1.1

Host HostC
  User userc
  Hostname HostC
  IdentityFile /home/userc/.ssh/keyfile
  ProxyJump HostB
```

And thats all now we can forward a port from HostC by calling this:

```
ssh -N HostC -L 8000:localhost:443
```

And we can access the web UI from HostC on localhost:8000.