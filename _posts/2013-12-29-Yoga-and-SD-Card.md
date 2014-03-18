---
published: true
description: How to install SD card drivers for Lenovo Idea-Pad Yoga
categories: [blog]
tags: [SD card, Lenovo, drivers, Linux, Fedora]
layout: post
---

In the Lenovo Ideapad Yoga laptop is a SD card slot but there are not default driver for that.

But you can simple install it with:

> sudo yum install kmod-staging

And now you can load it with:

> sudo modprobe rts5139

Or you can just reboot your laptop.

Please keep in mind that it don't work if you have secure boot on.
