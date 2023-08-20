---
published: true
description: Setup Let's Encrypt DNS challenge with iwantmyname
categories: [blog]
tags: [FreeBSD, dehydrated, pass, let's encrypt, Password Store, nginx, Gitea, TLS, iwantmyname]
layout: post
---

I use [pass - the standard unix password manager](https://www.passwordstore.org/) as my primary password manager.
Which worked great in the past. I have a git repository which I could clone from my phone and my computers 
and access all my passwords and secrets.
This git repository is hosted by a local [Gitea](https://gitea.io/en-us/) instance. 
Running on port 3000 with the built-in  TLS support (a very important detail).

### Intro

Until this week. 
What happened was that I destroyed my Pixel 3a and replaces it with a Pixel 4a.
Which is in itself sad enough. 
But when I tried to setup the password store the first step was to install 
[OpenKeychain: Easy PGP](https://play.google.com/store/apps/details?hl=en&id=org.sufficientlysecure.keychain)
and import my PGP key. 
This part worked fine so next up was to install the [Password Store (legacy)](https://play.google.com/store/apps/details?id=com.zeapo.pwdstore&hl=en) app.
So and as you can see apparently this app is legacy and receives no updates.
Fair enough lets just use the new app with the same name [Password Store](https://play.google.com/store/apps/details?id=dev.msfjarvis.aps). 


Now the sad part starts the new app does not support custom ports as part of the git clone url. 
And I was not able to clone the repository with a key or a any other way.
Neither with the new or the old app.
Which is very unfortunate because to setup many apps you need to login again which is hard without a password manager.


So my first thought was to just use the built in TSL option and run it on the standard port 443.
A good idea in theory in practice this would mean some weird hacks to allow to bind sub 1024 port 
for non root user or running Gitea as root.
Both not great options but I tried the first one regardless there is [a guide](https://www.ricalo.com/blog/gitea-server-freebsd/#allow-the-git-user-to-bind-to-the-https-port)
how to make that happen with `mac_portacl`. (I quickly gave up on this idea)

So the next best thing to do is to finally the correct way and use a [nginx reverse proxy](https://docs.gitea.io/en-us/reverse-proxies/#nginx) with proper Let's Encrypt certificates.
Last time I tried to to that two years ago I gave up halfway through. Not sure why.

### Let's Encrypt setup

So here is how my Let's Encrypt setup works.
I use [dehydrated](https://github.com/dehydrated-io/dehydrated) running on my host 
with a cron job. 
This is the entry in the root crontab:

```
0 0 */5 * * /usr/local/etc/dehydrated/run.sh >/dev/null 2>&1
```

And the `run.sh` script calls `dehydrated` with my user `l33tname`
to refresh the certificates and copy them inside the jails.

```
#!/bin/sh

deploy() 
{
  host=$1
  cert_location="/usr/local/etc/dehydrated/certs/$host.domain.example/"
  deploy_location="/zroot/iocage/jails/$host/root/usr/local/etc/ssl/"

  cp -L "${cert_location}privkey.pem" "${deploy_location}privkey.pem"
  cp -L "${cert_location}fullchain.pem" "${deploy_location}chain.pem"
  chmod -R 655 "${deploy_location}"
}

su -m l33tname -c 'bash /usr/local/bin/dehydrated --cron'
deploy "jailname"
iocage exec jailname "service nginx restart"

su -m l33tname -c 'bash /usr/local/bin/dehydrated --cleanup'

echo "ssl renew $(date)" >> /tmp/ssl.log
```

If you want to adapt this script change the user (`l33tname`) the name of the jail `jailname`
and your domain in `cert_location` (`.domain.example`).
Make sure all the important directories are owned by your user,
currently that is (`.`, `accounts`, `archive`, `certs`, `config`, `domains.txt`, `hook.sh`)

Now the question becomes how does `dehydrated` refresh the certificates over DNS.
And I'm happy to report things got better since I last tried it.
I get my domains from iwantmyname and they provide an [API to update DNS entries](https://iwantmyname.com/developer/domain-dns-api).
Since I tried it last time even the deletion works so no unused txt entries in your DNS setup. 

And here is how the `hook.sh` script looks which enables all this magic:

```
#!/usr/local/bin/bash

export USER="myemail@example.com
export PASS="mypassword"

deploy_challenge() {
    local DOMAIN="${1}" TOKEN_FILENAME="${2}" TOKEN_VALUE="${3}"

    curl -s -u "$USER:$PASS" "https://iwantmyname.com/basicauth/ddns?hostname=_acme-challenge.${DOMAIN}.&type=txt&value=$TOKEN_VALUE"
  echo "\nSleeping to give DNS a chance to update"
  sleep 10
}

clean_challenge() {
    local DOMAIN="${1}" TOKEN_FILENAME="${2}" TOKEN_VALUE="${3}"
    curl -s -u "$USER:$PASS" "https://iwantmyname.com/basicauth/ddns?hostname=_acme-challenge.${DOMAIN}.&type=txt&value=delete"
    sleep 10
}
```

Or lets say these are the two functions you need to implement with the `curl` commands needed for iwantmyname.

What is left now it so change the config to use this script.
Make sure `HOOK="${BASEDIR}/hook.sh"` is set and `CHALLENGETYPE="dns-01"`
and any other config values you want like email.

Then you can list all hosts names you want a certificate inside `domains.txt`.
Last but not least accept the TOS from Let's Encrypt with something like this:

```
su -m l33tname -c '/usr/local/bin/dehydrated --register --accept-terms'
```

Thats it! It takes some time to setup but it is worth it to have valid TLS certificates for all your services.

### Outro

With all that in-place I setup Gitea without TLS and setup a TLS proxy with nginx.
And this allows me to clone my password repository over https in the new app.
So finally I'm able to access all my passwords again an finishing the login on 
all my apps.
