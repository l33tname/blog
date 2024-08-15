---
published: true
description: Do your backups!
categories: [blog]
tags: [ZFS, remote, backup, FreeBSD, zfstools, worldbackupday]
layout: post
---

I have been told that the 31.03 international [backup](http://www.worldbackupday.com/) day is. 
So here is how I backup my server. This solution is based on the [solution Dave Eddy](http://www.daveeddy.com/2015/12/05/automatic-zfs-snapshots-and-backups/) has built.


I use [zfstools](https://www.freshports.org/sysutils/zfstools/) to create the snapshots. Zfstools is a collection of ruby scripts 
which are modeled after the automatic ZFS snapshots in OpenSolaris. ([source](https://github.com/bdrewery/zfstools)).

So the first step is to install it and enable it on all data sets which should be snapshotted.

```
pkg install zfstools
zfs set com.sun:auto-snapshot=true DATASET
```

And we need to add these to our crontab. It should be a user which is allowed to create and destroy snapshots.
This creates snapshots which are looking like this `zfs-auto-snap_hourly-2017-03-30-20h00`. The `-k` is to keep 0 sized snapshots, you can remove that 
if you don't like it. The second thing is the Interval in which these snapshots are created. And the last one is how many of these types of snapshots are 
kept. Here is a good default:

```
PATH=/etc:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
15,30,45 * * * * zfs-auto-snapshot -k frequent  4
0        * * * * zfs-auto-snapshot -k hourly   24
7        0 * * * zfs-auto-snapshot -k daily     7
14       0 * * 7 zfs-auto-snapshot -k weekly    4
28       0 1 * * zfs-auto-snapshot -k monthly  12
```

Now we have a good local snapshot policy. But our snapshots are only local. To send them offside I use the script `zincrsend`
which is created by Dave Eddy.

```
fetch https://raw.githubusercontent.com/bahamas10/zincrsend/master/zincrsend
mv zincrsend /usr/local/sbin
sudo chown root:wheel zincrsend
sudo chmod 555 zincrsend
```

Now we need to create a remote dataset and setup an ssh server.

```
sysctl vfs.zfs.min_auto_ashift=12
sudo zpool create -f -O atime=off -O utf8only=on -O normalization=formD -O aclinherit=passthrough -O compression=lz4 tank mirror ada2 ada3
sudo zfs allow -u $USER aclmode,compression,mountpoint,create,mount,receive,jailed,snapdir tank
```

This creates a the my remote datasets and allows my ssh user to write to it. ([source](https://dan.langille.org/2015/02/16/zfs-send-zfs-receive-as-non-root/))
Now this is out of our way we can edit `zincrsend` and add the ssh connection informations.


```
# information about the server on the receiving end
remote_server='iapetus'
remote_user='l33tname'
remote_port='22'
remote_dataset='tank' # zpool name most likely
remote_command_prefix='' # leave blank for nothing
remote_ssh_opts=(-i /root/iapetus_backup) # additional opts to give to ssh

# prefix to use for snapshots created by this script
snapshot_prefix='zincrsend_'
```

*HINT* this can take a very long time depending on your data size and your network speed. Now we can test `zincrsend` and it should look like this:

```
processing dataset: tank/movie

creating snapshot locally: tank/movie@zincrsend_1481374186
cannot open 'tank/movie': dataset does not exist
no snapshot found for tank/movie - doing full send/recv
zfs sending tank/movie@zincrsend_1481374186 to tank/movie
receiving full stream of tank/movie@zfs-auto-snap_weekly-2016-11-13-00h14 into tank/movie@zfs-auto-snap_weekly-2016-11-13-00h14
received 1.50TB stream in 15331 seconds (103MB/sec)
receiving incremental stream of tank/movie@zfs-auto-snap_weekly-2016-11-20-00h14 into tank/movie@zfs-auto-snap_weekly-2016-11-20-00h14
received 312B stream in 3 seconds (104B/sec)
.......


script ran for ~526 minutes (31609 seconds)

ok - took 526 minutes

---------------------------------
```

If that worked we can extend crontab to clean up unused snapshots and send all changes to our offside location weekly.


```
2        0 * * 7 /usr/local/sbin/zfs-cleanup-snapshots
13       0 * * 7 /usr/local/sbin/zincrsend
```

That's it do your backups!
