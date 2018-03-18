---
published: true
description: Migrate plexpy to tautulli
categories: [blog]
tags: [FreeBSD, plexpy, tautulli, plex, monitoring]
layout: post
---

What is [tautulli](http://tautulli.com/)? From there site: "Tautulli is a 3rd party application that you can run alongside your Plex Media Server to monitor activity and track various statistics."
And if you where already a plexpy user, it's the same but better. And here is how you migrate
your existing plexpy installation to tautulli.

The first thing is to install it:

```
pkg install tautulli
```

Note: I'm not sure if this port is already in the quarterly package repos since I build 
[my own packages](/blog/2017/05/25/Poudriere/). 


Update the `/etc/rc.conf` to (`tautulli_user` is by default nobody):

```
tautulli_enable="YES"
tautulli_user="plex"
```

Stop plexpy and copy the config and database.
Make sure `config.ini` and `tautulli.db` are owned by the `tautulli_user` you use!

```
service plexpy stop
cp /usr/local/plexpz/config.ini /var/db/tautulli/config.ini
cp /usr/local/plexpz/plexpy.db /var/db/tautulli/tautulli.db
```

And that's it you can start tautulli and enjoy the cool new interface.

```
service tautulli start
```