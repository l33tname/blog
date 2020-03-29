---
published: true
description: Hex S The Good, the Bad and the Ugly
categories: [blog]
tags: [router, hEX S, MikroTik, apu, network]
layout: post
---

I am in the fortuned situation to have a [fiber7](https://www.init7.net/en/internet/fiber7/) directly to my home.
This means unfortunately goodbye to my apu4d2 board from [pcengines](https://pcengines.ch/apu4d2.htm).
Because I couldn't figure out why the performance was capt at ~300 Mbps.
And there is no way to connect a sfp module without a media convert to a apu board.
Which is a extra device meaning an extra thing which can fail.
So I asked [@wauwuff](https://twitter.com/@wauwuff) for recommendations on what to get.
An this is why I got the MikroTik hEX S.
Here are the specs I was most excited about:

- first of all [@wauwuff](https://twitter.com/@wauwuff) promised me that it would deliver 1Gbits speed
- Passive PoE up to 57V out port
- SFP port
- price point

What this means for me is that I can reduce from Router, PoE injector and Media converter to
just one device, the hEX S.


## The Good

The Hardware is amazing. Don't get me wrong it is a plastic box.
If you are not the type to get exited by a plastic box don't get your hopes up.
But it is a plastic box which delivered on all the things I hopped it would.
Most important of all it is capable to do 1Gbits.


## The Bad

For some reason I wasn't able to connect to the router because the password wasn't reset properly.
The bright side of that? It's time to figure out how the reset works.
Which is not that hard if you can follow written instructions ([Netinstall](https://wiki.mikrotik.com/wiki/Manual:Netinstall)).
Obviously I failed my first 2 attempts. Because reading is hard.
On big downside of this process for me is that it is windows software.


## The Ugly

The software, with one small exceptions.
DDNS was super easy to setup.

```
/ip cloud set ddns-enabled=yes
/ip cloud print
```

Everything else was and is a pain to setup and configure.
The software UX is less than ideal.
The problem is not the the UI, which is not pretty but who cares.
What do I mean by this?
Mostly the software is built around functions and not workflows.
Let's take OpenVPN as example to set it up you need to navigate
through at least 3 sub-menus to configure.
This is on top of a OpenVPN implementation which is very limited.
No UDP, LZO compression and limited Cryptography support.


In general many things which should be in the same place are very disconnected.


And then there are minor issue.
I needed to force PoE to power my Ubnt access point like this:

```
/interface ethernet poe set ether5 poe-out=forced-on
```

As well as the Terminal which has a weird auto-completion feature
which completes without pressing tab.
