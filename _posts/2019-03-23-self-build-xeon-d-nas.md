---
published: true
description: Self build Xeon D NAS
categories: [blog]
tags: [NAS, MBD-X10SDV-6C-TLN4F-O, 10GbE, Xeon D-1528, supermicro, SC721TQ-250B]
layout: post
---

## Requirements for my new NAS

I thought it's 2019 and time for 10GbE. Also I was bored, so I upgraded my
[Dell T20](/blog/2014/07/16/Dell-T20-Review/) after 5-ish years. 
The main features I was looking for: lower power consumption, 10GbE Network and 
M.2 SSD boot support.


M.2 SSD boot support is important to me since I upgraded the Dell T20 with a PCI adapter
to have a M.2 SS as boot device. Which did not work as well as expected and I needed a 
USB stick for `/boot`. This is very annoying. 


10GbE Network is self explanatory it is the future and who doesn't want the future now. 


Last but not least less power consumption the Dell T20 comes with a [Intel(R) Xeon(R) CPU E3-1225 v3](https://ark.intel.com/content/www/us/en/ark/products/75461/intel-xeon-processor-e3-1225-v3-8m-cache-3-20-ghz.html)
which has a 84 watt TDP which is unfortunate but I needed the power for Plex movie encoding. 
But as time has gone on CPUs use less power for the same or more performance. 


## What I built

![how my new NAS looks](/blog-bilder/2019-03-23-self-build-xeon-d-nas.jpg)

As motherboard I selected the [MBD-X10SDV-6C-TLN4F-O](https://www.supermicro.com/products/motherboard/Xeon/D/X10SDV-6C-TLN4F.cfm).
It ticks all the boxes, I wanted to have from new hardware. Also I think it is one of the 
better price/value motherboards you can find. It has 2 10GbE NICs. It has the M.2 SSD slot on 
the motherboard and I can boot FreeBSD from it. And it uses a [Intel(R) Xeon(R) CPU D-1528](https://ark.intel.com/content/www/us/en/ark/products/91198/intel-xeon-processor-d-1528-9m-cache-1-90-ghz.html)
which is 35 watt TDP. That is less than halve of the E3-1225 v3 at the same passmark score.
This means it still is fast enough to live transcode my plex moves for me. 


This motherboard is now in a Supermicro mini tower [SC721TQ-250B](https://www.supermicro.com/products/chassis/tower/721/SC721TQ-250B). 
In general I like the case but in comparison to the Dell T20 it is not as quite as it use to be. Mostly the fault of 
the 30mm fan on the PSU I guess. But on the bright site with this case it is possible to hot-swap disks. And I got an 
insanely good deal on it.


To power my ZFS pool which is still on 3x8TB HDDs (never did an update on this as far as I remember)
I added Kingston Server-Branded Memory KSM24RD4/32HAI 32GB ECC, Registered. As boot disk I use a
Samsung SSD 860 EVO M.2 500GB which is more than enough space for the base OS and all my jails.


## Migration

Thanks to ZFS and [iocage](https://github.com/iocage/iocage) the migration was very smooth. I just 
setup FreeBSD 12.0 and copied over a few config files like `/etc/rc.conf`. Exported the ZFS volume 
on the Dell T20, put the disk in the new server and just imported it again. I did the same for 
all the jails just `iocage export` and `iocage import` on the other side. After some minor 
jail config tweaks all my services where up and running again. (I forgot to migrate a jail but that is 
a story for an other time) The entire migration took about 45 min from start to finish.
