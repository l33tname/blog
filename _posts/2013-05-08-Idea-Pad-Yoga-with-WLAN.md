---
published: true
description: How to install W-LAN drivers for Lenovo Idea-Pad Yoga
categories: [blog]
tags: [W-LAN, Lenovo, drivers, Linux, Fedora, git]
layout: post
---

I bought a new Lenovo Ideapad Yoga laptop and the first thing I did was installing Fedora.
Fedora works nice on it, touch screen works out of the box \o/, though the card reader doesn't work but I don't use it, so it's ok for me. But a big problem is that there is no RJ45 Ethernet plug, only W-LAN and this doesn't
work out of box. So I search and found some creepy sources for it but they all fail to compile so I wrote the
author of these drivers and he told me that it's on Github. Conclusion: I'm too stupid for google.


If you take the source from Github it compiles fine on my laptop. So start with cloning the repo doing:

> git clone https://github.com/lwfinger/rtl8723au.git

And compile and install it with:

> make && sudo make install

After a restart you should have W-LAN. You need to do this step every time you update your kernel!
You may need one of these packages to compile if you don't have them already.

> make gcc kernel-header kernel-devel patch

## Driver quality
The drivers are really stable and I have no problems, no connection losses. And I tested the speed with netio and it's a bit slower than the windows drivers but I think most people, including me, can live with that. In the table you can see the speed differences between the Linux and windows drivers.

<table class="table table-striped table-bordered">
 <tr>
  <th>packet size</th>
  <th>Fedora 18 (TCP)</th>
  <th>Windows 8 (TCP)</th>
  <th>Fedora 18 (UDP)</th>
  <th>Windows 8 (UDP)</th>
 </tr>
 <tr>
  <th>Receiving from client, packet size  1k</th>
  <td>6919.15 KByte/s</td>
  <td>7439.19 KByte/s</td>
  <td>7834.33 KByte/s</td>
  <td>8996.88 KByte/s</td>
 </tr>
 <tr>
  <th>Sending to client, packet size  1k</th>
  <td>4100.83 KByte/s</td>
  <td>6174.82 KByte/s</td>
  <td>11.19 MByte/s</td>
  <td>11.20 MByte/s</td>
 </tr>
 <tr>
  <th>Receiving from client, packet size 16k</th>
  <td>7644.62 KByte/s</td>
  <td>8564.73 KByte/s</td>
  <td>8770.21 KByte/s</td>
  <td>9020.33 KByte/s</td>
 </tr>
 <tr>
  <th>Sending to client, packet size 16k</th>
  <td>4455.27 KByte/s</td>
  <td>7974.70 KByte/s</td>
  <td>11.32 MByte/s</td>
  <td>11.42 MByte/s</td>
 </tr>
 <tr>
  <th>Receiving from client, packet size 32k</th>
  <td>7878.99 KByte/s</td>
  <td>8494.75 KByte/s</td>
  <td>10.15 MByte/s</td>
  <td>10.94 MByte/s</td>
 </tr>
 <tr>
  <th>Sending to client, packet size 32k</th>
  <td>3990.65 KByte/s</td>
  <td>8145.11 KByte/s</td>
  <td>11.44 MByte/s</td>
  <td>11.46 MByte/s</td>
 </tr>
</table>
