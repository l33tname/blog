---
categories:
- blog
date: 2016-01-04T00:00:00Z
description: Bootstrap FreeBSD boot from USB
published: true
tags:
- boot
- FreeBSD
- PCI SSD
- Dell T20
- ZFS
url: /2016/01/04/msata-is-not-msata/
---

I upgraded my system disk from a SSD to a PCI SSD. Mostly because the [Dell T20](http://l33tsource.com/blog/2014/07/16/Dell-T20-Review) has only 4 SATA 
ports. So I bought a 'DeLock PCI-Express-x4 Kontroller' and a 'S'amsung 850 EVO M.2'. Which was not the smartest choice because there are two types 
of M.2 SSDs some have a PCI interface and others have a SATA interface and you need the ones with PCI. That is why I bought a few days later a 
'Samsung SSD SM951 128GB Workstation' which worked as expected, well almost. The card should work with out drivers and it should be possible to boot 
from it. And here comes the fun part of course I couldn't boot from it, so I had the smart idea it should be easy to bootstrap my FreeBSD from a USB drive 
and then boot from the PCI SSD card. And here is how you can do it:


First of all you should know the name of your devices (you can use something like `camcontrol devlist`) in my case:

```
USB drive: da1 
PCI SSD: ada0
```

Now we can delete all data and partitions on these two devices. This assumes 
of course that you don't have any data you need on it. And I would recommend to disconnect and backup all disk you also 
have connected to your Server. It's just to easy to wipe the wrong disk or copy things in the wrong partition. If you losing any data 
it's not my fault! That said here is how to clean out the old partition and create the new ones.

```
# clean out old partitions
gpart destroy -F da1
gpart destroy -F ada0

# create partitions
gpart create -s gpt da1
gpart create -s gpt ada0

gpart add -a 4k -s 512K -t freebsd-boot da1
gpart add -a 4k -t freebsd-zfs da1

gpart add -a 4k -s 4G -t freebsd-swap ada0
gpart add -a 4k -t freebsd-zfs ada0
```

With that out of the way we can copy the boot code to the USB drive. 

```
gpart bootcode -b /boot/pmbr -p /boot/gptzfsboot -i 1 da1
```

The next step is to create the the zfs pools and datasets for a FreeBSD install. 

```
# create pools
zpool create -o altroot=/mnt -o cachefile=/tmp/zpool.cache usbboot /dev/da1p2
zpool create -o altroot=/mnt -o cachefile=/tmp/zpool.cache ssdboot /dev/ada0p2

zfs set mountpoint=none usbboot
zfs set mountpoint=none ssdboot

zfs set checksum=fletcher4 usbboot
zfs set checksum=fletcher4 ssdboot


# create datasets
zfs create -o mountpoint=none ssdboot/ROOT
zfs create -o mountpoint=/ ssdboot/ROOT/default
zfs create -o mountpoint=/home ssdboot/home
zfs create -o mountpoint=/usr ssdboot/usr
zfs create -o mountpoint=/var ssdboot/var
zfs create -o mountpoint=/tmp ssdboot/tmp

chmod 1777 /mnt/tmp

zfs create -o mountpoint=/uboot -o compression=off usbboot/boot
zpool set bootfs=usbboot/boot usbboot


zpool import -f -R /mnt usbboot 
or 
zfs mount


zpool set bootfs=none ssdboot
```

After all this we can finally copy the FreeBSD files to the file system.

```
cd /usr/freebsd-dist
for i in base kernel src ports games lib32; do
xz -d -c $i.txz | tar -C /mnt -xf -
done

chroot /mnt
touch /etc/rc.conf
touch /etc/fstab
touch /boot/loader.conf
```

Before we can reboot we need to configure a few settings in various files. This should load your FreeBSD from the SSD and mount your swap.

```
# /etc/rc.conf
zfs_enable="YES"

# /boot/loader.conf
zfs_load="YES"
vfs.root.mountfrom="zfs:ssdboot/ROOT/default"

# /etc/fstab
/dev/ada0p1    none    swap    sw    0    0
```

As a last step we need to copy `/boot` on the USB drive.

```
mkdir /mnt/uboot/boot
cp -r /boot/* /mnt/uboot/boot/
cp /tmp/zpool.cache /mnt/uboot/boot/zfs/
```

Now is the time to reboot an pray, if everything worked it should boot FreeBSD. 
If everything works we can symlink the boot directory.


```
rm -rf /boot/
ln -s /uboot/boot /boot
```

This works except one thing somehow it forgets after a reboot which pools are mounted. So after every reboot 
I mount my pools manually.

```
sudo zpool import usbboot
sudo zpool import tank
sudo ezjail-admin start
```

This is not as bad as it sounds since I only reboot for kernel updates but if you know why this happesn or 
how to fix it, there is a [FreeBSD forums thread](https://forums.freebsd.org/threads/bootstrap-booting-from-a-root-on-zfs.53516/) for it. 
You can also direct me directly over mail, twitter whatever. 