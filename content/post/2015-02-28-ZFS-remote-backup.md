---
categories:
- blog
date: 2015-02-28T00:00:00Z
description: Incremental backup with ZFS over the internet
published: true
tags:
- ZFS
- backup
- FreeBSD
- Dell T20
- N54L
url: /2015/02/28/ZFS-remote-backup/
---

Since no one bought my N54L NAS I need to do something with it. So my first guess was a remote backup, and thats exactly
what I did.

So thats why I visited [@ronyspitzer][1] this weekend (well some weekend in the past (ages ago), since I failed to finish this). So I grab my hardware and thats how it looks:

![hardware relocation][2]

Maybe I should do finally my driving licence, or stop transporting so much stuff from A to B.


But lets talk about the setup. The N54L is loaded with 3 x 2TB drives and 1 TB for the system. So the first step was to install FreeBSD with root on zfs which is really easy with the FreeBSD 10 installer. With the other drives I build a raidz.

> zpool create -O utf8only=on -O normalization=formD -O casesensitivity=mixed -O aclinherit=passthrough tank raidz ada0 ada1 ada2

This is basically the same setup like my [Dell T20][3]. And a very usefull hint for me was the sysctl for [geom debugflags][4], becaue I used disks with old partition tables on it and I got allways a error like "Device Busy" so you can force to create a
zfs volume anyway with `sysctl kern.geom.debugflags=16`.

With the pool in place, I enable ssh on my NAS with a password less key login.
Maybe I write a blog post about that to. (Probably not but you can find how that is done on teh interwebz)

![remote server][5]

After all this is done, I can finally use my 'master' backup scripts. Well you probably don't have a user to receive. But ZFS is nice so there is a nice way for this:

> sudo zfs allow -u l33tname create,receive,mount,userprop,destroy,send,hold,compression,aclinherit tank

This allow everything which is necessary to receive snapshots on tank. You can check your config with `zfs allow tank`.

{% gist fliiiix/71f3a754a01b558a7cd0 %}

Since you probably won't send every time everything you can use the incremental script. That's what I do.
Every night with cron.

> 30 2 * * * /root/backup/backup_incremental >> /root/backup/backup.log

{% gist fliiiix/764dc878e2a0a590c58a %}

<s>The only thing what I can thought off is missing in my scripts is the case when you run a backup while a backup process is still running.
I will probably fix this for the future version.</s>


Actually I did this before I blog about it.


  [1]: https://twitter.com/ronyspitzer
  [2]: /blog-bilder/2015-02-28-ZFS-remote-backup.jpg
  [3]: http://l33tsource.com/blog/2014/07/16/Dell-T20-Review/
  [4]: http://www.freebsdonline.com/content/view/731/506/
  [5]: /blog-bilder/2015-02-28-ZFS-remote-backup-remote.jpg
