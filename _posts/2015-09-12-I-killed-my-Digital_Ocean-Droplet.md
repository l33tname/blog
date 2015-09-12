---
published: true
description: How I killed my Digital Ocean droplet
categories: [blog]
tags: [Digital Ocean, droplet, FreeBSD, ip, BalCCon2k15]
layout: post
---

I'm not at [vBSDcon]( http://www.verisign.com/en_US/internet-technology-news/verisign-events/vbsdcon/index.xhtml ) but I'm at 
[BalCCon2k15]( https://2k15.balccon.org/index.php?title=Main_Page ) which is a small conference in serbia (and very cool). 
So while I was scrolling through my RSS feeds I saw that FreeBSD 10.2 is released. As usual I rush things which means I didn't made a backup of 
my droplet. Kids always do a backup beforehand, if you do things like a kernel update. Not exactly sure why but I heard it helps a lot if you fuck up. And yeah I fuck up a lot. Anyway what happened was I ran

```
freebsd-update fetch install
freebsd-update -r 10.2
freebsd-update install
reboot
```

And after the reboot nothing. Cool, at least DigitalOcean has a HTML5 VNC. Of course this doesn't work with Firefox. 
And it's very buggy. But it's enough to figure out whats happening. And I needed to configure my local keyboard to U.S English
to type characters like / (still no idea why). At this point I was able to access my droplet over VNC where I didn't had Internet. I found out that 
a Interface without a IP address does basically nothing. Long story short you need to configure the Interface yourself. Still not 
exactly sure why I didn't need to do it after the first setup. Anyway adding the interface configuration to my `rc.config` restart 
my networking and routing and how would suspected that my droplet is back online. 

What I'm trying to tell you dear reader, do proper backups beforehand. 