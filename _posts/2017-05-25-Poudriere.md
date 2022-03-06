---
published: true
description: Build it yourself
categories: [blog]
tags: [FreeBSD, poudriere, nginx, pkg, packages, ports]
layout: post
---


I build my own FreeBSD pkgs and you can do that too! And here are a few notes how to do it.
Important note make sure you have *enough RAM* or/and an SWAP partition. I found out the hard 
way that 8GB RAM are not good enough. So I added a 30GB SWAP partition how much you really need 
depends heavily on which ports you build. 

## poudriere

So the first step is to install poudriere the thing that builds your ports automatically and does all the magic, and a web-server.
I used Nginx but if like Apache there are [example configs]( https://github.com/freebsd/poudriere/tree/master/src/share/examples/poudriere ) for both.
More on how to setup that later.


```
$ pkg install poudriere nginx
$ cat /usr/local/etc/poudriere.conf
# poudriere.
#
ZPOOL=zroot

# the host where to download sets for the jails setup
# You can specify here a host or an IP
# replace _PROTO_ by http or ftp
# replace _CHANGE_THIS_ by the hostname of the mirrors where you want to fetch
# by default: ftp://ftp.freebsd.org
#
# Also note that every protocols supported by fetch(1) are supported here, even
# file:///
# Suggested: https://download.FreeBSD.org
FREEBSD_HOST=https://download.FreeBSD.org

# By default the jails have no /etc/resolv.conf, you will need to set
# RESOLV_CONF to a file on your hosts system that will be copied has
# /etc/resolv.conf for the jail, except if you don't need it (using an http
# proxy for example)
RESOLV_CONF=/etc/resolv.conf

# The directory where poudriere will store jails and ports
BASEFS=/usr/local/poudriere

# Use portlint to check ports sanity
USE_PORTLINT=yes

# Use tmpfs(5)
# This can be a space-separated list of options:
# wrkdir    - Use tmpfs(5) for port building WRKDIRPREFIX
# data      - Use tmpfs(5) for poudriere cache/temp build data
# localbase - Use tmpfs(5) for LOCALBASE (installing ports for packaging/testing)
# all       - Run the entire build in memory, including builder jails.
# yes       - Only enables tmpfs(5) for wrkdir
# EXAMPLE: USE_TMPFS="wrkdir data"
USE_TMPFS=yes

# If set the given directory will be used for the distfiles
# This allows to share the distfiles between jails and ports tree
DISTFILES_CACHE=/usr/ports/distfiles

# Automatic Dependency change detection
# When bulk building packages, compare the dependencies from kept packages to
# the current dependencies for every port. If they differ, the existing package
# will be deleted and the port will be rebuilt. This helps catch changes such
# as DEFAULT_RUBY_VERSION, PERL_VERSION, WITHOUT_X11 that change dependencies
# for many ports.
# Valid options: yes, no
CHECK_CHANGED_DEPS=yes

# Path to the RSA key to sign the PKGNG repo with. See pkg-repo(8)
PKG_REPO_SIGNING_KEY=/usr/local/etc/ssl/keys/pkg.key

# ccache support. Supply the path to your ccache cache directory.
# It will be mounted into the jail and be shared among all jails.
CCACHE_DIR=/var/cache/ccache

# Choose the default format for the workdir packing: could be tar,tgz,tbz,txz
# default is tbz
WRKDIR_ARCHIVE_FORMAT=txz

# Disable linux support
NOLINUX=yes

# URL where your POUDRIERE_DATA/logs are hosted
# This will be used for giving URL hints to the HTML output when
# scheduling and starting builds
URL_BASE=http://poudriere.l33t.network/

# Keep older package repositories. This can be used to rollback a system
# or to bisect issues by changing the repository to one of the older
# versions and reinstalling everything with `pkg upgrade -f`
# ATOMIC_PACKAGE_REPOSITORY is required for this.
# Default: no
KEEP_OLD_PACKAGES=yes

# Define pkgname globs to boost priority for
# Default: none
PRIORITY_BOOST="llvm*"
``` 

The config is mostly self explaining. The only thing I would highlight is that you should install and enable ccache since 
it can speed up your build significantly. As you can see the packages are getting signed by `/usr/local/etc/ssl/keys/pkg.key`. To do that 
you need to create this key and here is how:

```
mkdir -p /usr/local/etc/ssl/keys /usr/local/etc/ssl/certs
chmod 600 /usr/local/etc/ssl/keys
openssl genrsa -out /usr/local/etc/ssl/keys/pkg.key 4096
openssl rsa -in /usr/local/etc/ssl/keys/pkg.key -pubout > /usr/local/etc/ssl/certs/pkg.cert
```

I would recommend to backup this key to a save location. Also we need these two directory to be present for poudriere. 

```
mkdir -p /var/cache/ccache
mkdir -p /usr/ports/distfiles
```

I build my own packages mostly to live a life on the edge, so I configured my Makefile to use all the latest software versions.
This is the same config I would use uf I build ports locally, but instead of `/etc/make.conf` its `/usr/local/etc/poudriere.d/11amd64-make.conf` (jailname-make.conf). To find which versions are available I recommend to look in [bsd.default-versions.mk](https://cgit.freebsd.org/ports/tree/Mk/bsd.default-versions.mk). So my Makefile looks like this:

```
# cat /usr/local/etc/poudriere.d/11amd64-make.conf
DEFAULT_VERSIONS= mysql=10.1m php=7.0 python3=3.6 ruby=2.4
```

Now we need to create the portstree and create a jail. I only use on portstree and one jail but you can 
use multiple without a problem. For example to build i368 and amd64 ports on the same build server.  


```
# create portstree
poudriere ports -c
# create a jail
poudriere jail -c -j 11amd64 -v 11.0-RELEASE -a amd64
```

We are almost done, here is a example list with some ports I like to build. 
A good place to search for port names is [freshports](http://www.freshports.org/).

```
% cat ~/pkglist
editors/vim-lite
www/nginx
multimedia/plexpy
multimedia/plexmediaserver-plexpass
devel/ruby-gems
sysutils/rubygem-bundler
```

You may also want to change some options for some ports, and it's easy just:

```
poudriere options -p category/port
```

I use it mostly with the addition of `-n` to configure only that port and keep the defaults for 
all dependent ports.

### Finally!

Now we can update our portstree and build our ports for the first time!
Warning: Depending on your portlist and your pc/server this can take several hours, 
so maybe just build what you really need or buy fast hardware.

```
poudriere ports -u
poudriere bulk -f ~/pkglist -j 11amd64
```

## Nginx

While writing this I realized that this sounds like a lot of work but trust me, it's up and running in 
~ 20 minutes. Basically you could just copy the packages which where just build and install them. But it's 
very convenient to distribute them with Apache or Nginx they have some [example configs]( https://github.com/freebsd/poudriere/tree/master/src/share/examples/poudriere ). So here is my config:


```
$ cat /usr/local/etc/nginx/nginx.conf
load_module /usr/local/libexec/nginx/ngx_mail_module.so;
load_module /usr/local/libexec/nginx/ngx_stream_module.so;

#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    
    gzip on;
    gzip_http_version 1.0;
    gzip_comp_level 6;
    gzip_proxied any;
    gzip_min_length  1100;
    gzip_buffers 16 8k;
    gzip_types text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript image/gif image/jpeg image/png application/json image/svg+xml;

    types {
        text/plain                            log;
    }

    server {
        listen       80;
        server_name  poudriere.l33t.network;
        root         /usr/local/share/poudriere/html;
            
            # Allow caching static resources
            location ~* ^.+\.(jpg|jpeg|gif|png|ico|svg|woff|css|js|html)$ {
            add_header Cache-Control "public";
            expires 2d;
        }

        location /data {
            alias /usr/local/poudriere/data/logs/bulk;

            # Allow caching dynamic files but ensure they get rechecked
            location ~* ^.+\.(log|txz|tbz|bz2|gz)$ {
                add_header Cache-Control "public, must-revalidate, proxy-revalidate";
            }
            # Don't log json requests as they come in frequently and ensure
            # caching works as expected
            location ~* ^.+\.(json)$ {
                add_header Cache-Control "public, must-revalidate, proxy-revalidate";
                access_log off;
                log_not_found off;
            }
            # Allow indexing only in log dirs
            location ~ /data/?.*/(logs|latest-per-pkg)/ {
                autoindex on;
            }
            break;
        }

        location /packages {
            alias /usr/local/poudriere/data/packages;
            autoindex on;
        }
    }
}
```

## Install your packages


To simplify the task I create a setup directory which the two important files `pkg.cert` and `poudriere.conf`.
And add this below the `location /packages` block. 

```
location /setup {
   alias /usr/local/share/poudriere/setup;
   autoindex on;
}
```

The `poudriere.conf` files looks something like this:

```
poudriere: {
  url: "http://poudriere.l33t.network/packages/11amd64-default",
  mirror_type: "http",
  signature_type: "pubkey",
  pubkey: "/usr/local/etc/ssl/certs/pkg.cert",
  enabled: yes
}
```

Now we can just create two directories and fetch these two files.

```
mkdir -p /usr/local/etc/pkg/repos
mkdir -p /usr/local/etc/ssl/certs

fetch http://poudriere.l33t.network/setup/pkg.cert -o /usr/local/etc/ssl/certs/
fetch http://poudriere.l33t.network/setup/poudriere.conf -o /usr/local/etc/pkg/repos/
```

Since you just downloaded these files over http, it's a good idea to check the content, since theoretically 
anyone could tamper with them. Also recommend to disable the official packages if you don't know how to mix and match them.

```
echo "FreeBSD: { enabled: no }" > /usr/local/etc/pkg/repos/FreeBSD.conf
```

Now you use `pkg` as you would normally. 

## Update your ports

So now the only thing is to update your ports from time to time like this:

```
poudriere ports -u
poudriere bulk -f ~/pkglist -j 11amd64
```

And you might also want to update the jail it self from time to time.

```
sudo poudriere jail -u -j 11amd64 # update the jail sometimes!
```

Thats it have fun with your custom build packages!
