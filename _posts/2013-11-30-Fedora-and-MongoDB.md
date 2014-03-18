---
description: Mongo DB on Fedora
published: true
categories: [blog]
tags: [Mongo DB, Fedora, systemd, bug]
layout: post
---

If I just follow the official [instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/), 
I get an error everytime:

<pre>
 systemctl status mongod.service
mongod.service - SYSV: Mongo is a scalable, document-oriented database.
   Loaded: loaded (/etc/rc.d/init.d/mongod)
   Active: failed (Result: timeout) since Sun 2013-09-08 11:26:11 CEST; 51s ago
  Process: 3166 ExecStart=/etc/rc.d/init.d/mongod start (code=exited, status=0/SUCCESS)
   CGroup: name=systemd:/system/mongod.service
           └─3174 /usr/bin/mongod -f /etc/mongod.conf
</pre>

If you look at the error log, you will find something like this: `PID file /var/run/mongo/mongod.pid not readable (yet?) after start.`
There is a bug report since 01 04 2013 https://jira.mongodb.org/browse/SERVER-9202. So the problem is that the default location to store the pid file is
`/var/run/mongodb/mongod.pid`, but systemd looks at `/var/run/mongo/mongod.pid`. 

To fix this, just change the location in the config file '/etc/mongod.conf': `pidfilepath = /var/run/mongo/mongod.pid`. 
My first thought was to create the directory '/var/run/mongo' and change the owner and group to mongod (chown mongod:mongod).

But on most modern systems /var/run is a tempfs file system so you need to create a config file in `/lib/tmpfiles.d` and add the config file `echo “d /var/run/mongo 0755 mongod mongod” > mongo.conf`.
