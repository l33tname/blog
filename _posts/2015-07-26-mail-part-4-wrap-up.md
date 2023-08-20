---
description: Mail server wrap-up and debugging
published: true
categories: [blog]
tags: [FreeBSD, Mail, DNS, wrap-up, debugging]
layout: post
---


The simplest way to check if everything work as expected, is to configure 
one of your new mail accounts in your mail client and send a mail to the 
test service of [http://www.mail-tester.com/](http://www.mail-tester.com/).
If something not working there is a good chance that you find a hint in your 
mail log which you find there -> `/var/log/mail`. 


I used also [http://mxtoolbox.com/](http://mxtoolbox.com/) which has a few nice 
tools to check your DNS setup and SMTP.

Many useful things are stolen and copied from these articles:

* [OpenBSD Mail Server](http://technoquarter.blogspot.ch/p/series.html)
* [dkim](http://www.dkim.org/info/dkim-faq.html)
* [OpenSMTPD, Dovecot and SpamAssassin](http://guillaumevincent.com/2015/01/31/OpenSMTPD-Dovecot-SpamAssassin.html)
* [Small Mail Server with Salt, Dovecot and OpenSMTPD](https://blog.al-shami.net/2015/01/howto-small-mail-server-with-salt-dovecot-and-opensmtpd/)
* [BernardSpil/OpenSMTPd](https://wiki.freebsd.org/BernardSpil/MailServer#OpenSMTPd)
* [Running OpenSMTPd inside a FreeBSD Jail](https://github.com/OpenSMTPD/OpenSMTPD/wiki/Running-OpenSMTPd-inside-a-FreeBSD-Jail)


**Special Thanks to**

* Bernard Spil [@Sp1l]( https://twitter.com/Sp1l ): for the hint that [sendmail_enable="NONE"]( https://twitter.com/Sp1l/status/626329431599136768 ) is enough 

This is not a part of the three part series:

* [Setup smtp](/blog/2015/07/26/mail-part-1-setup-smtp-opensmtpd/)
* [Setup dkim](/blog/2015/07/26/mail-part-2-dkim/)
* [Setup imap](/blog/2015/07/26/mail-part-3-setup-imap-dovecot/)
* [wrap-up {you are here}](/blog/2015/07/26/mail-part-4-wrap-up/)
