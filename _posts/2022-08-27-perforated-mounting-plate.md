---
published: true
description: Home Network Perforated Mounting Plate
categories: [blog]
tags: [router, hEX S, MikroTik, network, mounting, Blechschrauben, Montageblech, Raspberry Pi]
layout: post
---

I planned to write this blog posts ~2 years ago.
But for some reason I never did.
It is about how I mounted my router (see: [hEX S The Good The Bad The Ugly][1]),
and my primary and secondary Raspberry Pi running DNS (see: [DNS Server on NetBSD][2] and [DNS Server on Debian][3]).

## Iteration 1
As you can see the first iteration of this setup was just to dump all the devices on the ground and get them running.
This was even before I switched to the hEX S router.

![network devices with awful cable management on the floor][6]

## Iteration 2
The next step was to figure out how to mount my devices to the perforated mounting plate (Montageblech, gelocht, verzinkt).
For the hEX S this was simple, as Mikrotik (the manufacturer of the devices) [states][9]:

> This device is designed for use indoors by placing it on the flat surface or mounting on the wall,
> mounting points are located on the bottom side of the device, screws are not included in the package.
> Screws with size 4x25 mm fit nicely.

But what about the Raspberry Pi?
Let's 3D print something I found a great [Raspberry Pi Wall Mount][4]
where I adapted the mount to fit the distance between the two screw holes.

![Raspberry Pi Wall Mount 3D printed red][5]

I googeled that the correct screws are Blechschrauben 4.2x9.5mm.
Since you can not buy just a handful of these I own now a 100 of them.
(If you know me, and need these screws for something let me know)
For some reason they are awful to work with or I was holding it wrong.
They don't work to mount the router because the screw head does not fit the
hEX S mounting on the back.
And I could not really screw them into the plate.
I ended up just using random screws I had from things to make it happen.
Which brings us to the next iteration:

![hEX S and Raspberry Pi mounted on wall plate][7]

## Iteration 3
And since then I improved the cable management a bit and
also mounted the second Raspberry Pi.
Which gives us the current state:

![hEX S and both Raspberry Pi mounted on wall plate][8]


[1]: /blog/2020/03/29/hex-s-the-good-the-bad-the-ugly/
[2]: /blog/2016/07/10/Build-a-dns-server-on-NetBSD/
[3]: /blog/2016/08/13/Build-a-dns-server-on-Debian/
[4]: https://www.thingiverse.com/thing:2085090
[5]: /blog-bilder/2022-08-27-perforated-mounting-plate-rpi-mount.jpg
[6]: /blog-bilder/2022-08-27-perforated-mounting-plate-iteration-1.jpg
[7]: /blog-bilder/2022-08-27-perforated-mounting-plate-iteration-2.jpg
[8]: /blog-bilder/2022-08-27-perforated-mounting-plate-iteration-3.jpg
[9]: https://help.mikrotik.com/docs/display/UM/hEX+S
