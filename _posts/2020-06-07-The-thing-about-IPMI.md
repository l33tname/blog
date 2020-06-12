---
published: true
description: What I learned about IPMI
categories: [blog]
tags: [BMC, IPMI, FreeBSD, supermicro, ipmitool]
layout: post
---


You might read my blog post about my CPU running to hot
or not then you can do that [here](/blog/2020/05/24/cpu-temperature-monitoring/).

This incident lead me to investigate the capabilities of my IPMI a bit more.
The Intelligent Platform Management Interface or for short IPMI
is the interface to your BMC.
BMC is the baseboard management controller which is a scary computer in your computer
running a network stack and interface directly with your hardware.
In general I think it is a good idea to keep that stuff in a very protected network segment.

My main interest was to play around with the cooling fan RPM.
Where I didn't really succeeded.
But regardless of that here are two of the things I learn in the process.
I used a `MBD-X10SDV-6C-TLN4F-O` Mainboard and installed the `ipmitool` package on FreeBSD.


### Reset user password

The first thing is I set a password and apparently I typed it wrong twice.
Not sure how that can happen but it did.
And here is how to undo that:

```
sudo ipmitool user list
sudo ipmitool user set password 3 PASSWORD
```

List the users and set an new password. (In this case the new password would be `PASSWORD`)
In my case the user had the id 3.


### Reboot BMC

And the second thing I learned how to reboot the BMC
independent from the computer itself.
The issue I had was that a fan failure (me short circuiting the pwm pin of a fan)
put all other fans to 100%.
Turns out, this is annoyingly loud.
As we learned in the intro the BMC is just a computer,
meaning we can reboot just like a computer (interdependently for the server).

```
sudo ipmitool mc reset warm
```

The important bit here is `warm`.
If you use `cold` it would restart your server as well.


### Resources

Here are a few resource in no particular order I consulted.

- [set fan thresholds on my Super Micro H11DSi-NT](https://blog.pcfe.net/hugo/posts/2018-08-14-epyc-ipmi-fans/)
- [SuperMicro Fan Speed Won't Slow](https://forums.servethehome.com/index.php?threads/supermicro-fan-speed-wont-slow.5179/)
- [gist: ikus060/smx8fancontrol](https://gist.github.com/ikus060/26a33ce1e82092b4d2dbdf18c3610fde)
- [Supermicro IPMI Fan control](https://forums.servethehome.com/index.php?threads/supermicro-ipmi-fan-control.12025/)
- [Restarting an IBM BMC without restarting the server itself](https://serverfault.com/questions/205658/restarting-an-ibm-bmc-without-restarting-the-server-itself)
- [IPMI reset (259242)](https://support.oneidentity.com/de-de/kb/259242/ipmi-reset)
