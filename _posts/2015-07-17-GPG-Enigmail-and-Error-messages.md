---
description: Enigmail error messages are the worst
published: true
categories: [blog]
tags: [Fedora 22, GPG, Enigmail, Thunderbird]
layout: post
---

I got a GPG encrypted mail, which should be a good thing since encryption and these things.
But every time I use GPG something does not work. And every time the error messages are useless.


So the moral of this blog post is: If you are a developer **write meaningful error messages**.


A short overview what my setup is, I have a Fedora 22 with gpg2 and my default mail client is Thunderbird.
And to use Thunderbird with GPG I use the [Enigmail](https://www.enigmail.net/) plugin which if it's working 
an okayish way to read and write encrypted mails. 

What was my problem? Well if you read the error messages I guess something like you haven't imported your 
private key yet.

> gpg: decryption failed: No secret key

> Error - no matching private/secret key found to decrypt message

So I checked that with `gpg -K` and I see my key, I even extracted the encrypted part from the mail and 
decrypted it on the command line without a problem. Thanks to the Internet I was able to find other people 
with the [same problem](http://askubuntu.com/questions/562853/pgp-enigmail-problem-can-no-longer-decrypt-or-sign-my-own-messages). 
And one of this posts gave me the right idea. By default there is no pinentry-program installed. After I installed one 
with `sudo dnf install pinentry-qt4` and restarted my Thunderbird it can magically encrypt the message.  