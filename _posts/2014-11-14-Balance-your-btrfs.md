---
published: true
description: Your disk if full but it's not
categories: [blog]
tags: [btrfs, balance, Linux, Fedora]
layout: post
---
When your ` btrfs fi df` show much unused space, but your programms crash because they can't write.
It's probably that your drive is full anyway. 

If your filesystem looks like this:

```
# btrfs fi show /
Label: 'fedora_XXXXX'  uuid: ff4be388-XXXX-XXXX-XXXX-e5b02d8ac312
	Total devices 2 FS bytes used 61.55GiB
	devid    1 size 103.40GiB used 103.40GiB path /dev/mapper/luks-bf4bdc39-XXXX-XXXX-XXX-4fb5e13c5056
```

As you can see your disk use 103.40GiB of 103.40GiB which means full. In this state you can do 
probably not much. So first add more space to your btrfs volume.

```
btrfs device add -f /dev/sdc /
```

A 1 GB usb stick should be enough, but make sure there are no data on it. 

Now you can balance it with:
```
btrfs balance start -dusage=80 /
```

Right, there is no space between -d and usage. You can change the usage parameter,
more in this case means it use more time but free more space. 

After that is done you can remove your usb stick:
```
btrfs device delete /dev/sdc /
```

And if you now check
```
# btrfs fi show /
Label: 'fedora_XXXXX'  uuid: ff4be388-XXXX-XXXX-XXXX-e5b02d8ac312
	Total devices 1 FS bytes used 61.55GiB
	devid    1 size 103.40GiB used 65.03GiB path /dev/mapper/luks-bf4bdc39-XXXX-XXXX-XXX-4fb5e13c5056
```

Source and detailed informations: http://marc.merlins.org/perso/btrfs/post_2014-05-04_Fixing-Btrfs-Filesystem-Full-Problems.html
