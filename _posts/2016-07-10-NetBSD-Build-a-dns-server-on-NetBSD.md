---
published: true
description: Build a simple dns with a Raspberry Pi and NetBSD
categories: [blog]
tags: [dns, NetBSD, BSD, dnsmasq, Raspberry Pi]
layout: post
---

I run localy a dnsmasq server as my primary DNS server. This has two main 
reasons the first one is that it's really simple and small. Secondly it's platform indipenden, meaning 
I can run it on my NetBSD but also on my FreeBSD or even on linux. This means also I can just reuse the same config files. 

Let's get started you need the right NetBSD image for your Raspberry Pi, if I'm not mistaken 
it should be evbarm-earmv6hf for a Raspberry Pi and evbarm-earmv7hf for the newer ones.
Here is how to download it and flash it to your SD card.

Warning: as always double check that you are flashing your SD card and not something else!

```
wget http://ftp.netbsd.org/pub/NetBSD/NetBSD-7.0.1/evbarm-earmv6hf/binary/gzimg/rpi.img.gz
gunzip rpi.img.gz
sudo dd if=rpi.img of=/dev/sdX
```

And thats all preparation needed, now you can plug a keyboard, ethernet, the SD card and HDMI cable in your 
Raspberry Pi and power it up. Then you just need to wait until the system has resized the root filesystem and 
prepared everything else. 

The first thing you should do is to login as root and set a password for the root account.
After that you can add a user like this (the wheel group is necessary to use su later):

```
useradd -m -G wheel l33tname
passwd l33tname
```

Also recomended is to edit `/etc/rc.conf` I changed the hostname and configured a static ip, meaning disable
dhcpcd. Here are the important bits:

```
hostname=janus
ifconfig_usmsc0="192.168.17.5 netmask 0xffffff00"
defaultroute=192.168.17.1
#dhcpcd=YES
sshd=YES
```

After a reboot you should be able to login with your new user over ssh.
Now you need time, downloading and unpacking or a cvs checkout of all ports take some time on a 
old Raspberry Pi.

Using the cvs source:

```
cd /usr && cvs -q -z2 -d anoncvs@anoncvs.NetBSD.org:/cvsroot checkout -P pkgsrc
```

Or download the tar archive:

```
ftp ftp://ftp.netbsd.org/pub/pkgsrc/pkgsrc-2016Q2/pkgsrc.tar.gz
su
tar -xzf pkgsrc.tar.gz -C /usr
```

I use cvs because you can update it with:

```
cd /usr/pkgsrc && cvs update -dP
```

But read [Where to get pkgsrc and how to keep it up-to-date](https://www.netbsd.org/docs/pkgsrc/getting.html) for 
more informations.

With the pkgsrc in place we can compile and install dnsmasq.

```
cd /usr/pkgsrc/net/dnsmasq
make
make install
cp /usr/pkg/share/examples/rc.d/dnsmasq /etc/rc.d/
```

The configuration is simple you only need 3 files. The first one is the main configuration which
is located in `/usr/pkg/etc/dnsmasq.conf`


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

As you can see the dns upstream servers are configured in /etc/resolv.conf.dnsmasq I'm using 
these serveres, but feel free to use any other dns server you trust.

```
nameserver 85.214.73.63
nameserver 208.67.222.222
nameserver 62.141.58.13
```

And last but not least the `/etc/hosts` file where you now can add all your hosts.

```
#  = IP =       =  Domainname =               = PC name =   
192.168.17.1     pandora.l33t.network          pandora
192.168.17.5     janus.l33t.network            janus 
192.168.17.30    atlas.l33t.network            atlas
```

And that's it you are almost finished with configure your dnsmasq, the last thing is obviously 
to start the deamon and test it. So add "dnsmasq=YES" it to `/etc/rc.conf` and start it with `service dnsmasq start`.

Test it with somethin like `dig`:

```
$ dig pandora @192.168.17.6 | grep pandora
; <<>> DiG 9.10.3-P4-RedHat-9.10.3-9.P4.fc22 <<>> pandora @192.168.17.6
;pandora.			IN	A
pandora.		0	IN	A	192.168.17.1
```
