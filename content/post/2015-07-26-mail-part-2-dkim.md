+++
date = "2015-07-26T00:00:00Z"
title = "Setup dkim"
description = "DKIM - Mail servers are not fun II"
tags = ["FreeBSD", "Mail", "DNS", "dkim", "dkimproxy", "ssl"]
url = "/2015/07/26/mail-part-2-dkim/"

+++

DKIM is a technology to validate and protect you against spoofing of your emails.
This is achieved by putting a public key in the DNS records an sign all outgoing mails
with with the private key. So everyone can validate if you authorised to send these mails.

To use this with OpenSMTPD we use `dkimproxy` which we need to install first.

```
pkg install dkimproxy
echo 'dkimproxy_out_enable="YES"' >> /etc/rc.conf
```

And of course we need to configure it:

```
$ cat /usr/local/etc/dkimproxy_out.conf
# specify what address/port DKIMproxy should listen on
listen    10.0.0.10:10027

# specify what address/port DKIMproxy forwards mail to
relay     10.0.0.10:10028

# specify what domains DKIMproxy can sign for (comma-separated, no spaces)
domain    domain.tdl

# specify what signatures to add
signature dkim(c=relaxed)
signature domainkeys(c=nofws)

# specify location of the private key
keyfile   /usr/local/openssl/private/dkim.key

# specify the selector (i.e. the name of the key record put in DNS)
selector  dkimselector
```

The important bits here are the listen and relay ip:port combination. For 
the most setups you can use 127.0.0.1 since the DKIM proxy needs only be 
accessible on the for your OpenSMTPD server. Of course you need to replace domain.tdl
with your domain but the rest you can more or less just copy.


As you can see there is a key file which we now need to create. 
And the public key part of this key goes in our DNS. 

```
openssl genrsa -out /usr/local/openssl/private/dkim.key 1024
openssl rsa -in /usr/local/openssl/private/dkim.key -pubout -out dkim_public.key
```

And this public key we can now put in our DNS, this should look something like this:

```
dkimselector._domainkey IN TXT "k=rsa; t=s; p=MIGfMA0GCSqGS...CMaVI02QIDAQAB"
```

![dns settings for DKIM](/blog-bilder/2015-07-26-dns-dekim-settings.png)


Here is `MIGfMA0GCSqGS...CMaVI02QIDAQAB` your public key with out the -----BEGIN PUBLIC KEY-----
and -----END PUBLIC KEY----- in one line. An easy way to print your public key without new lines 
is this: `cat dkim_public.key | tr -d '\n'`. 


That's everything we need to configure on the DKIMproxy site. We can start the service with 
`service dkimproxy_out start`.

# Update OpenSMTPD configuration 

We have a running DKIM proxy but it's useless if we don't route our mails through it.
To achieve this we update our smtpd config (`/usr/local/etc/mail/smtpd.conf`).


In a first step we add a new listen directive. The port here 10028 should match 
the one you configured for the relay in the dkimproxy configuration. 

```
listen on lo1 port 10028 tag DKIM_OUT
```


And we need to replace 

```
accept from local for any relay
```

with

```
accept tagged DKIM_OUT for any relay
accept from local for any relay via "smtp://10.0.0.10:10027"
```

After a OpenSMTPD restart (`service smtpd restart`) it should tag all mails with a valid DKIM signature.

This is the second part of a three part series:

* [Setup smtp](/blog/2015/07/26/mail-part-1-setup-smtp-opensmtpd/)
* [Setup dkim {you are here}](/blog/2015/07/26/mail-part-2-dkim/)
* [Setup imap](/blog/2015/07/26/mail-part-3-setup-imap-dovecot/)
* [wrap-up](/blog/2015/07/26/mail-part-4-wrap-up/)
