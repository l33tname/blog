---
description: OpenSMTPD - Mail servers are not fun I
published: true
categories: [blog]
tags: [FreeBSD, Mail, DNS, smtp, OpenSMTPD]
layout: post
---

This is mostly my personal mail server documentation a bit polished in three blog posts.

# DNS setup

Set a MX record to a subdomain like mail.domain.tdl and then the 
mail.domain.tdl points to your IP. Don't forget to increase the TTL of this records if 
everything works. [Why?](https://medium.com/@N/how-i-lost-my-50-000-twitter-username-24eb09e026dd)
I set my TTL to 259200 sec, which are 3 days  

Make sure your [reverse DNS](https://en.wikipedia.org/wiki/Reverse_DNS_lookup) match the hostname of your mail server!

And you should probably set the [Sender Policy Framework](https://en.wikipedia.org/wiki/Sender_Policy_Framework)

```
doamin.tdl.                 IN   TXT    "v=spf1 mx mx:domain.tdl -all"
```

# Create users

Now we need a user, replace `$USERNAME` with the account name. If your email address should be 
hi@domain.tdl your account name is hi.

```
pw user add $USERNAME -m -s /sbin/nologin -c "mail user ($USERNAME)" # create user account
passwd $USERNAME                                                     # change password

mkdir /home/$USERNAME/mbox                                           # create mail directory
chown -R $USERNAME:$USERNAME /home/$USERNAME/mbox                    # own the directory to the right user
```

If you need to create a few accounts maybe use this [script](https://gist.github.com/fliiiix/00d0b9439e827d58263e), 
where you can just run this script with the user name as parameter.

# Install OpenSMTPD

Before we can install OpenSMTPD we need to stop and remove sendmail. 
So first we stop it with:

```
service sendmail stop
```

Then we can edit `/etc/rc.conf` and add these lines, to make sure sendmail is not started automaticly after a reboot.

```
sendmail_enable="NONE"
```

Now we can install OpenSMTPD which is really really easy, it's just:

```
pkg install opensmtpd
```

and add to `/etc/rc.conf`

```
smtpd_enable="YES"
```

and your done. Well almost we need to create the SSL certificates and configure the OpenSMTPD.

# Create your SSL certs

As the first step we symlink the certificate root to the global certificate root location.
If it's not alreay done.

```
ln -s /usr/local/etc/ssl/cert.pem /etc/ssl/cert.pem
```

At this point we can create our certificates.

```
openssl genrsa -out /usr/local/openssl/private/mail.domain.tdl.key 4096
openssl req -new -x509 -key /usr/local/openssl/private/mail.domain.tdl.key -out /usr/local/openssl/certs/mail.domain.tdl.crt -days 1440

Country Name (2 letter code) [AU]: NL
State or Province Name (full name) [Some-State]:Amsterdam         
Locality Name (eg, city) []:Amsterdam
Organization Name (eg, company) [Internet Widgits Pty Ltd]:l33tsource Ltd
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:mail.domain.tdl
Email Address []:admin@domain.tdl
```

By default these key and certificate should only be accessible to the root user.
So we fix that with `chmod`.

```
chmod 500 /usr/local/openssl/private/mail.domain.tdl.key
chmod 500 /usr/local/openssl/certs/mail.domain.tdl.crt
```

# OpenSMTPD configuration

With the SSL certificate in place we can edit the smtpd config (`/usr/local/etc/mail/smtpd.conf`).

```
pki mail.domain.tdl key "/usr/local/openssl/private/mail.domain.tdl.key"
pki mail.domain.tdl certificate "/usr/local/openssl/certs/mail.domain.tdl.crt"

listen on lo1 port 25 hostname mail.domain.tdl tls pki mail.domain.tdl
listen on lo1 port 587 hostname mail.domain.tdl tls-require pki mail.domain.tdl auth mask-source

table aliases file:/etc/mail/aliases

accept from any for domain "domain.tdl" alias <aliases> deliver to maildir "~/mbox"
accept from local for any relay
```

This is it. Really simple and short. What this does is listen on port 25 and 587 
on the lo1 interface (this should obviously match your interface)
and accept encrypted connections. The key and certificate location are configured 
with the pki keyword. And the messages are delivered to the home directory of the user
in a folder called mbox.


Now we can start the `smtpd` service and test it with telnet.


```
telnet servername 25
	EHLO mail.domain.tdl 
	MAIL FROM:<FROM@domain.tdl> 
	RCPT TO:<TO@domain.tdl> 
	DATA 
	Subject: Testmessage 
	(blank line) 
	This is a test.
	(blank line) 
	. 
	QUIT 
```

If it's says something like `250 2.0.0: 5x549x2a Message accepted for delivery`, congratulation your SMTP works.


This is the first part of a three part series:

* [Setup smtp {you are here}](/blog/2015/07/26/mail-part-1-setup-smtp-opensmtpd/)
* [Setup dkim](/blog/2015/07/26/mail-part-2-dkim/)
* [Setup imap](/blog/2015/07/26/mail-part-3-setup-imap-dovecot/)
* [wrap-up](/blog/2015/07/26/mail-part-4-wrap-up/)
