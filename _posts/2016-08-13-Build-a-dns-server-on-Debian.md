---
published: true
description: Build a simple dns with a Raspberry Pi and Debian
categories: [blog]
tags: [dns, Debian, dnsmasq, Raspberry Pi]
layout: post
---

Perhaps you read the blog post [Build a DNS server on NetBSD](http://l33tsource.com/blog/2016/07/10/Build-a-dns-server-on-NetBSD/). 
This is essentially the same thing except I use debian this time. The idea behind this is if one system goes down the other 
one should be running. So basically diversity for zero DNS downtime. (There will be a third blog post with images of the hardware I used)

I used the raspbian lite image from the official [raspberrypi](https://www.raspberrypi.org/downloads/raspbian/) site.

So as always unzip it and dd it to the right sd card.

```
$ unzip 2016-05-27-raspbian-jessie-lite.zip
$ sudo dd if=2016-05-27-raspbian-jessie-lite.img of=/dev/sde
2709504+0 records in
2709504+0 records out
1387266048 bytes (1.4 GB) copied, 169.065 s, 8.2 MB/s
```

Now you can start your pi and login in with `user:pi & password:raspberry`.
It's highly recommended to change your password with `passwd`. Also always 
a good idea is to upgrade your system.


```
apt-get update && apt-get upgrade
```

Configure a static IP on your interface:


```
$ cat /etc/dhcpcd.conf 
# A sample configuration for dhcpcd.
# See dhcpcd.conf(5) for details.

noarp

interface eth0
static ip_address=192.168.17.6/24	
static routers=192.168.17.1
```

Now we are ready to install dnsmasq

```
sudo apt-get install dnsmasq
```

We can use now the exact same config files as in the previous post.

*`/etc/dnsmasq.conf`*

```
# Change this line if you want dns to get its upstream servers from
# somewhere other that /etc/resolv.conf
resolv-file=/etc/resolv.conf.dnsmasq

# Add other name servers here, with domain specs if they are for
# non-public domains.
server=/XXXX.loc/192.168.XXX.XXX

# Add local-only domains here, queries in these domains are answered
# from /etc/hosts or DHCP only.
local=/l33t.network/

# Set the cachesize here.
cache-size=500
```

*`/etc/resolv.conf.dnsmasq`*

```
nameserver 85.214.73.63
nameserver 208.67.222.222
nameserver 62.141.58.13
```

*`/etc/hosts`*

```
#  = IP =       =  Domainname =               = PC name =   
192.168.17.1     pandora.l33t.network          pandora
192.168.17.5     janus.l33t.network            janus 
192.168.17.30    atlas.l33t.network            atlas
```

The only thing that slightly changes is the path of the first config file.

Side note since I use a resolv-file you need for some reasons also 
edit `/etc/default/dnsmasq` and uncomment this line: `IGNORE_RESOLVCONF=yes`.

Now you can restart dnsmasq and your DNS server is ready to use.
