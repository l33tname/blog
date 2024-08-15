---
published: true
description: Pull ZFS backup
categories: [blog]
tags: [ZFS, remote, backup, FreeBSD, pull, sanoid, syncoid]
layout: post
---

I got a good deal on a 18TB Harddisk.
Which was reason enough to rethink my backup setup.
Until now I used a push strategy where the system pushed the backup
to my backup system. (see blog post for reference [Zfs Remote Backups](/blog/2017/03/31/ZFS-remote-backups/))
This will change today!


The new strategy is that my backup system will pull the data itself.
This has a few advantages and makes it harder to if the main system
is compromised to compromise the backup.
I will also replace the shell scripts with [`sanoid`](https://www.freshports.org/sysutils/sanoid/) or actually with `syncoid`.
For snapshots I continue to use [`zfstool`](https://www.freshports.org/sysutils/zfstools/).


### The New Setup

On the system which should be backuped we need to install `sanoid` and add a user
with ssh key and minimal permissions.

```
# Install package
pkg install sanoid

# Add user
pw user add -n backup -c 'Backup User' -m -s /bin/sh

# Setup SSH with key
mkdir /home/backup/.ssh
echo "ssh-ed25519 AAA...jaM0 foo@bar.example" > /home/backup/.ssh/authorized_keys
chown -R backup:backup /home/backup/.ssh 
chmod 700 /home/backup/.ssh
chmod 600 /home/backup/.ssh/authorized_keys

# Give access to the ZFS pools for the new user
zfs allow -u backup aclinherit,aclmode,compression,create,mount,destroy,hold,send,userprop,snapshot tank
zfs allow -u backup aclinherit,aclmode,compression,create,mount,destroy,hold,send,userprop,snapshot zroot
```


As for the system which should pull the datasets.
We also install `sanoid` and add a small script to our crontab
which does all the magic and pulls all datasets we want to backup.
It also pushes the status to influx so alerting and graphing can be done.
(Careful with the script there are some things you need to update for your usecase!)


```
# Install package
pkg install sanoid

# Put script in crontab
$ crontab -l
13       0 * * 7	/root/backup.sh
```

The `/root/backup.sh` script:

```
#!/bin/sh

REMOTE='backup@hostname-or-ip'
KEY='/root/.ssh/backup-key'
lockfile='/tmp/backup.pid'
logfile=/var/log/backup/hostname_log.txt

mkdir -p $(dirname $logfile)

if [ ! -f $lockfile ]
then
    echo $$ > $lockfile
else
    echo "$(date): early exit ${lockfile} does exist previous backup still running" | tee -a $logfile
    exit 13
fi

# Backup a ZFS dataset by pulling it
# localhost is the host where this scripts runs,
# where as remote is the host which should get backuped
# $1: name of the dataset on the remote host
# $2: name of the dataset on the local host
# return: a status code, 0 if successful
backup_dataset() {
    remote_ds=$1
    local_ds=$2

    syncoid --sshkey=${KEY} --recursive --no-privilege-elevation ${REMOTE}:${remote_ds} ${local_ds} >> /tmp/raw_backup.log 2>&1
    code=$?

    echo "$(date): pulling ${remote_ds} -> ${local_ds} exit code was: ${code}" >> $logfile
    echo $code
}

start=$(date +%s)
echo "$(date): backup started (log: $logfile)" | tee -a $logfile

exit_code=0
exit_code=$((exit_code + $(backup_dataset 'tank/backup' 'tank/backup')))
exit_code=$((exit_code + $(backup_dataset 'tank/data' 'tank/data')))
exit_code=$((exit_code + $(backup_dataset 'tank/music' 'tank/music')))
exit_code=$((exit_code + $(backup_dataset 'tank/photography' 'tank/photography')))
exit_code=$((exit_code + $(backup_dataset 'tank/podcast' 'tank/podcast')))
exit_code=$((exit_code + $(backup_dataset 'zroot/iocage' 'tank/iocage')))
exit_code=$((exit_code + $(backup_dataset 'zroot/usr/home' 'tank/hostname-home')))

end=$(date +%s)
runtime=$((end-start))
echo "$(date): exit code: ${exit_code} script ran for ~$((runtime / 60)) minutes ($runtime seconds)" | tee -a $logfile

curl -i -XPOST -u mrinflux:password 'https://influx.host.example:8086/write?db=thegreatedb' \
        --data-binary "backup,host=hostname.example status=${exit_code}i
        backuptime,host=hostname.example value=${runtime}i"

rm -f $lockfile
exit $exit_code
```
