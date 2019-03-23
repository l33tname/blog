---
published: true
description: Dell T20 Review
categories: [blog]
tags: [server, NAS, Dell T20, FreeBSD]
layout: post
---

Since I start using [plex](http://plex.tv) my HP ProLiant MicroServer was to slow to transcoding movies for [Chromecast](http://l33tsource.com/blog/2014/08/26/Chromecast/).
So I had primarily two options, first I transcoding them not on the fly and save them to my NAS or I buy a new NAS. Obviously I bought a new one.

So I look around an found the Dell PowerEdge T20. The Key features for was the Intel Xeon processor which has enough power to transcoding movies. The possibility that 
you can extend the ram to 32GB is nice for ZFS which take advantage of that. Also nice is that the ethernet controller a Intel I217-LM is. Intel has a much better record 
for building stable and supported network controller. 

The downsides on my opinion are that only 4 hard drives fit in the case. And these hard drive cartridges don't look really rock-solid for me. 

![ssd image](/blog-bilder/2014-07-13-Dell-T20-RAM-Upgrade-img.jpg)

## Hardware

I upgrade the my RAM to 20GB, for this you can checkout my other [blog post](http://l33tsource.com/blog/2014/07/13/Dell-T20-RAM-Upgrade/) about this. 
For disks I use three WD Black with each 2TB space. And for my system drive I use one of my old SSD, just because I can.

For the future I plan to upgrade it with a network controller to play with things like [LACP](http://en.wikipedia.org/wiki/Link_aggregation#Link_Aggregation_Control_Protocol).

## Noise

What should I say, in a normal office environment you can't hear it. But it has two fans so you can hear it if it's really quiet, but for the most environments this shouldn't be that
big deal. So if you searching for something quiet and powerful I can really recommend the Dell T20.

## BIOS update

My BIOS version was A02. So you can simply go to the dell support site, download the BIOS .exe, copy it to your FAT formatted USB stick and select in the start menu (F12) BIOS Update. 
For some reason I must unplug it to restart. 

## Software

I run a FreeBSD 10 on it. Maybe I extend on this a bit what software I use. But for now, It looks to me as if every part of the hardware is supported on FreeBSD by default. (I like that)
