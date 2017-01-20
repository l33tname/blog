---
published: true
description: Fixing keycode
categories: [blog]
tags: [Lenovo, Yoga 13, Linux, Fedora, Fedora 25]
layout: post
---

I have a problem with my touchpad on my laptop. And to figure out what is wrong I checked `dmesg`
and found this unrelated problem. And fixing this problem should not hurt.

```
[ 3290.177993] atkbd serio0: Unknown key released (translated set 2, code 0xbe on isa0060/serio0).
[ 3290.178007] atkbd serio0: Use 'setkeycodes e03e <keycode>' to make it known.
```

As you can see it sends a unknown keycode which we can map with `setkeycodes e03e`. 
According to the Internet TM this is send every second and tells the OS the orientation of the 
Screen. So I mapped it to 255 to do nothing like this: `sudo setkeycodes e03e 255`. 
This solves the problem until the next reboot which is not good enough. 

So we create a systemd service file

```
$ cat /etc/systemd/system/setkeycodes.service 
[Unit]
Description=Change keycodes at boot

[Service]
Type=oneshot
ExecStart=/usr/bin/setkeycodes e03e 255

[Install]
WantedBy=multi-user.target
```

And enable the service:

```
sudo systemctl enable setkeycodes 
```