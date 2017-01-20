---
description: Enable nice splash screen
published: true
categories: [blog]
tags: [Fedora, splash screen]
layout: post
---

Just edit in `/etc/default/grub` the GRUB\_CMDLINE\_LINUX parameter and remove rhgb quiet.

>GRUB\_CMDLINE\_LINUX="rd.luks.uuid=luks-3c9b6347-1d19-4191-af16-4c156d1e8252 rd.luks.uuid=luks-9c380ed4-cac0-4112-a406-17de8c5b96e1 rhgb quiet"


After that you need to rebuild your grub with something like this:

>grub2-mkconfig -o /boot/grub2/grub.cfg

And now you have a fancy splash screen with text output. 
