+++
date = "2015-07-26T00:00:00Z"
title = "Setup imap"
description = "Dovecot (imap) - Mail servers are not fun III"
tags = ["FreeBSD", "Mail", "DNS", "dovecot", "dovecot2", "imap", "ssl"]
url = "/2015/07/26/mail-part-3-setup-imap-dovecot/"

+++

A mail server where your mail program can't receive your mails is a
bit lame. So this last post describes how you can setup a dovecot to 
serve your mails over imap.


The fist step as usual is to install it.

```
pkg install dovecot2
echo 'dovecot_enable="YES"' >> /etc/rc.conf
```

I personally use a really simple IMAP configuration if you need more, lets say something like 
pop3 support, you should definitely check out the [dovecot documentation](http://wiki2.dovecot.org/) because 
dovecot can almost everything.

But for a simple IMAP server it's just these few lines in your config (`/usr/local/etc/dovecot/dovecot.conf`).

```
protocols = imap
ssl = required
ssl_key = </usr/local/openssl/private/mail.domain.tdl.key
ssl_cert = </usr/local/openssl/certs/mail.domain.tdl.crt
mail_location = maildir:~/mbox
listen = *

userdb {
  driver = passwd
  args = blocking=no
}

passdb {
  driver = pam
  args = 
}
```

Hint: I use here the same ssl certificat and key as for the OpenSMTPD config. 


With the configuration file in place we can start (`service dovecot start`) and test the service.
For testing I used openssl, like this:

```
openssl s_client -connect mail.domain.tdl:993
```

It should print a lot of informations about your certificate and you should be able to login with:

```
a1 LOGIN yourunixusername yourunixpasswordincleartext
```

Which should return something like this:

```
a1 OK [CAPABILITY IMAP4rev1 LITERAL+ ... LIST-STATUS BINARY MOVE] Logged in
```

This is the last part of a three part series:

* [Setup smtp](/blog/2015/07/26/mail-part-1-setup-smtp-opensmtpd/)
* [Setup dkim](/blog/2015/07/26/mail-part-2-dkim/)
* [Setup imap {you are here}](/blog/2015/07/26/mail-part-3-setup-imap-dovecot/)
* [wrap-up](/blog/2015/07/26/mail-part-4-wrap-up/)
