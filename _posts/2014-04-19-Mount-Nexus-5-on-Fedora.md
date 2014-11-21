---
published: true
description: How to mount your nexus 5 smartphone on fedora
categories: [blog]
tags: [nexus 5, MTP, fedora, file transfer]
layout: post
---

I connect my phone with my laptop. And surprise it doesn't work. 

So I google around and based on this: http://tacticalvim.wordpress.com/2012/12/08/mounting-nexus-4-via-mtp-in-fedora-17/ I found a solution. (at least for Fedora 20 and Nexus 5 with MTP).

Install libs:

>  sudo yum -y install fuse fuse-libs libmtp simple-mtpfs

Update your udev rules:

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

### Update

There is a list with vendore id's http://developer.android.com/tools/device.html. 

|Company	USB | Vendor ID|
|-------------|----------|
|Acer | 	0502|
|ASUS |	0b05|
|Dell |	413c|
|Foxconn |	0489|
|Fujitsu |	04c5|
|Fujitsu Toshiba |	04c5|
|Garmin-Asus |	091e|
|Google |	18d1|
|Haier |	201E|
|Hisense |	109b|
|HTC |	0bb4|
|Huawei |	12d1|
|Intel |	8087|
|K-Touch |	24e3|
|KT Tech |	2116|
|Kyocera |	0482|
|Lenovo |	17ef|
|LG |	1004|
|Motorola |	22b8|
|MTK |	0e8d|
|NEC |	0409|
|Nook |	2080|
|Nvidia |	0955|
|OTGV |	2257|
|Pantech |	10a9|
|Pegatron |	1d4d|
|Philips |	0471|
|PMC-Sierra |	04da|
|Qualcomm |	05c6|
|SK Telesys |	1f53|
|Samsung |	04e8|
|Sharp |	04dd|
|Sony |	054c|
|Sony Ericsson |	0fce|
|Sony Mobile Communications |	0fce|
|Teleepoch |	2340|
|Toshiba |	0930|
|ZTE |	19d2|
