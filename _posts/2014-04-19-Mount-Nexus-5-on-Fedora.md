---
published: false
description: How to mount your nexus 5 smartphone on fedora
categories: [blog]
tags: [nexus 5, MTP, fedora, file transfer]
layout: post
---

I connect my phone with my laptop. And surprise it don't work. 

So I google around and base on this: http://tacticalvim.wordpress.com/2012/12/08/mounting-nexus-4-via-mtp-in-fedora-17/ I found a solution. (at least for Fedora 20 and Nexus 5 with MTP).

Install libs:

>  sudo yum -y install fuse fuse-libs libmtp simple-mtpfs

Update your udev roles:

> sudo vim /etc/udev/rules.d/51-nexus.rules 


```
#LG – Nexus 5
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666"
```

For Nexus 4 it's possible something like:

```
#Nexus 4
SUBSYSTEM=="usb", ATTR{idVendor}=="4ee1", MODE="0666"
```

Now just add aliases for it. For that add to your .bashrc these lines:

```
alias nexusmount="simple-mtpfs ~/your/mount/point"
alias nexusumount="fusermount -u ~/your/mount/point"
```

Now reboot to reload your udev rules and load the new modules.

After that just mount and unmount your device. 
