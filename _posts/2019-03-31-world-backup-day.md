---
published: true
description: Do your backups!
categories: [blog]
tags: [grafana, influx, ZFS, remote, backup, FreeBSD, worldbackupday]
layout: post
---

Today is the [world backup day](http://www.worldbackupday.com/en/).
This is a wonderful excuse to talk about how I do backups (again).

And I can happily report that the solution I build and blogged about is working perfectly.
(If you missed that here is the blog post from two years ago [ZFS remote backups](/blog/2017/03/31/ZFS-remote-backups/)).

The biggest change since then is the hardware. You might remember
that I own a [Dell T20](https://l33tsource.com/blog/2014/07/16/Dell-T20-Review/) which
is still very cool hardware but with a [Intel(R) Xeon(R) CPU E3-1225 v3](https://ark.intel.com/content/www/us/en/ark/products/75461/intel-xeon-processor-e3-1225-v3-8m-cache-3-20-ghz.html) it uses quit a bit of power.
That is why I switched to a self built solution with a [Intel(R) Xeon(R) CPU D-1528](https://ark.intel.com/content/www/us/en/ark/products/91198/intel-xeon-processor-d-1528-9m-cache-1-90-ghz.html). This is 35 watt TDP instead of 84 watt TDP. But you can
read all about that in my previous blog post [Self built NAS](/blog/2019/03/23/self-build-xeon-d-nas/)

The big improvement I implements since last year is the monitoring.
I switched from [observium](http://www.observium.org/) to telegraf, grafana and influx for monitoring.
The next logical step was to create a dashboard for my backup status.

This is how it looks (you can find the template in this [gist](https://gist.github.com/fliiiix/b8f98f9bc746dda9bced2ccdf22edb33)):

![grafana backup dashboard](/blog-bilder/2019-03-31-grafana-backup-dashboard.png)

Which is so much better than just write the infos to a log file
in `/tmp` and check it manually.

It is built with the [Line Protocol of influx](https://docs.influxdata.com/influxdb/v1.7/write_protocols/line_protocol_tutorial/).
Which allows to post data with curl.

```
curl -i -XPOST -u username:password 'https://hostname:8086/write?db=databasename' \
        --data-binary "backup,host=backuphost status=${code}i
backuptime,host=backuphost value=${SECONDS}i"
```

It is not perfect but it is the best solution I ever built.
And here is your reminder: do backups,
check if your backup was executed successful (visibility in a dashboard helps immensely)
and last but not least try to restore it. A backup with out restoring is useless.
