---
published: true
description: Fedora and Windows dualboot with grub2 (UEFI)
categories: [blog]
tags: [Fedora, Windows, UEFI, grub2, dualboot]
layout: post
---

#Fedora and Windows dualboot with grub2 (UEFI)


On my Lenovo IdeaPad Yoga I have a dualboot installation with Windows 8 and Fedora 18. My setup works fine with UEFI, however I'd prefer to boot Windows 8 out of grub.
So here is a small tutorial on how to add your windows installation to grub.

1. Install the following packages:

> sudo yum install grub2-efi os-prober shim

##Your UUID

Your first step is to find out the right UUID for the Windows partition. One way to do this is:

> sudo gdisk -l /dev/sda

Then you should see something like this:

<pre>
Number Start (sector) End (sector) Size Code Name
1 2048 616447 300.0 MiB 2700 Basic data partition
2 616448 821247 100.0 MiB EF00 EFI system partition
3 821248 1083391 128.0 MiB 0C01 Microsoft reserved part
4 1083392 204802047 97.1 GiB 0700 Basic data partition
5 204802048 205211647 200.0 MiB EF00 EFI System Partition
6 205211648 206235647 500.0 MiB 0700
7 206235648 222357503 7.7 GiB 8200
8 222357504 327215103 50.0 GiB 0700
9 327215104 500117503 82.4 GiB 0700
</pre>

In my case the Windows EFI partition is the first one, but if you are not sure, you can mount the EFI system partition and look if 'tree' prints out this:
<pre>
.
└── EFI
├── Boot
│ └── bootx64.efi
└── Microsoft
└── Boot
├── BCD
├── BCD.LOG
├── BCD.LOG1
├── BCD.LOG2
├── bg-BG
│ ├── bootmgfw.efi.mui
│ └── bootmgr.efi.mui
├── bootmgfw.efi
├── bootmgr.efi
├── BOOTSTAT.DAT
├── boot.stl
...
</pre>

Now it's time to get the UUID of this partition. You can do this with:

>sudo blkid /dev/sda2

This gives you something like:
> /dev/sda2: UUID="B8EA-3088" TYPE="vfat" PARTLABEL="EFI system partition" PARTUUID="9c0c3f2e-82a2-428d-9366-90f8c4580652"

##Update your grub config

You can now add your UUID to grub. Edit /etc/grub.d/40_custom and add the following lines. Replace "your_UUID" with the UUID from the previous step.

```
menuentry "Windows" {
  insmod part_gpt
  insmod fat
  insmod search_fs_uuid
  insmod chain
  search --fs-uuid --no-floppy --set=root your_UUID
  chainloader (${root})/efi/Microsoft/Boot/bootmgfw.efi
}
```

##The Rebuild

And finally you can rebuild the config with:

> grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
