---
published: true
description: Rebuild the Windows 10 EFI boot files
categories: [blog]
tags: [grub, grub2, Windows 10, Fedora, EFI]
layout: post
---

My Windows 8 had some weired problems today. Since I migrated this specific installation over three 
different hardware configurations, I didn't try to solve it. Instead I just reinstalled a Windows 10.
The installation of Windows 10 went smooth, even the creation of the USB stick worked at the first try.

But I wouldn't write a blog post if everything went flawless. Grub was unable to boot my new Windows 10.
And a simple rebuild didn't fix the problem.

```
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

It made it even worse after that the Windows option was vanished from my boot menu.


So to fix this you need to recreate the Windows EFI files. To do this, start `diskpart` and find your 
EFI partition. It's the one which is FAT formated and around 200MB large. 

```
DISKPART> list vol

  Volume ###  Ltr  Label        Fs     Type        Size     Status     Info
  ----------  ---  -----------  -----  ----------  -------  ---------  --------
  Volume 0                      FAT    Partition    200 MB  Healthy    System
  Volume 1                      RAW    Partition    585 GB  Healthy
  Volume 2                      NTFS   Partition    345 GB  Healthy
  Volume 3     E   System Rese  NTFS   Partition    500 MB  Healthy
  Volume 4     C                NTFS   Partition    223 GB  Healthy    Boot

DISKPART> sel vol 0

Volume 0 is the selected volume.

DISKPART> assign letter=b:

DiskPart successfully assigned the drive letter or mount point.

DISKPART>
```

This mounts the EFI partition to the letter b. 

Then open a cmd as admin and create the `Microsoft\Boot` directory and create the EFI boot files:

```
md b:\EFI\Microsoft\Boot
cd /d b:\EFI\Microsoft\Boot
bcdboot c:\Windows /s b: /f ALL
```

Now it's time to restart linux and recreate our grub config with:

```
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

Now everything works again.