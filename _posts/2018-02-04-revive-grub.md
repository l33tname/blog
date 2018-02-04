---
published: true
description: How to rebuild a grub2 config
categories: [blog]
tags: [Fedora, grub2, grub, Lenovo Yoga, Dell XPS 13]
layout: post
---


A long time ago in a galaxy far, far away I wrote my last blog post. Since then much has changed and is still the same.
But this blog post is about something which happened also a long time ago. I upgraded my Lenovo Yoga to a Dell XPS 13.
And this change meant that I stopped using the linux on my Lenovo Yoga. Which was very convenient at the time 
because my dual boot stopped working. The reason for that was that my grub.cfg got corrupted and I was only able to boot windows. 
Since the Dell XPS 13 picked up all my daily linux tasks, there was no need to do something about it. 
But today this changes! I told my self, mostly because I plan to convert that thing to a windows only laptop. 
Yeah I know windows *buuuhh me*. 

### Rebuild Grub

So here is how I rebuilt my grub config:

Step one download and create a live Fedora usb stick. Yes I still use and love Fedora deal with it :D
Boot it and open a console and find out who the boss is (hopefully you!).

```
sudo -s
```

Apparently I had a luks setup back in the days. So here is how to decrypt and mount it:

```
sudo cryptsetup luksOpen /dev/sda8 rootfs
sudo mount /dev/mapper/rootfs /mnt
mount: /mnt: unknown filesystem type 'swap'.
```

Well maybe it would help not to pick the swap partion, so close it fast before someone realizes `sudo cryptsetup luksClose rootfs`. So here is what 
happens when you actually select the right partition:

```
[liveuser@localhost ~]$ sudo cryptsetup luksOpen /dev/sda9 rootfs
Enter passphrase for /dev/sda9: 
[liveuser@localhost ~]$ sudo mount /dev/mapper/rootfs /mnt
[liveuser@localhost ~]$ ls /mnt/
1  bin  boot  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```


Almost done my `/boot` and the `efi` life on different partitions so I need to mount them as well:

```
mount /dev/sda7 /mnt/boot        
mount /dev/sda2 /mnt/boot/efi
```


Some bind mount magic:


```
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys
```

chroot and build a new config

```
chroot /mnt
grub2-mkconfig --output=/boot/efi/EFI/fedora/grub.cfg
```

Reboot and hurray everything worked fine. It's just sad that I don't have anything on that laptop that I still need.
What a waste of time.
