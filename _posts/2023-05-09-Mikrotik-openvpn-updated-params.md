---
published: true
description: Update OpenVPN setting on MikroTik
categories: [blog]
tags: [router, OpenVPN, OPNsense, hEX S, MikroTik, apu, network]
layout: post
---

I run a site-to-site tunnel: [OPNsense to MikroTik site-to-site tunnel](/blog/2020/04/23/OPNsense-to-MikroTik-site-to-site-tunnel/).
Which runs fine but the support for OpenVPN in MikroTik is not very good.
At some point I need to investigate Wireguard for this site-to-site connection.

But for now I still run OpenVPN and a recent upgrade of OpenVPN on OPNsense made my tunnel fail because
it could not find a common cipher.

```
No common cipher between server and client. Server data-ciphers: 'AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305', client supports cipher 'AES-256-CBC'
```

As you can see MikroTik with the settings I documented uses `AES-256-CBC`.
According to the [documentation](https://help.mikrotik.com/docs/display/ROS/OpenVPN) it should also do `aes256-gcm`
which would match the supported `AES-256-GCM`.

But how would one do that, because the UI does not offer any options for that.
Turns out you need to do that on the terminal only.

Here is how:
```
/interface/ovpn-client/
edit <connection-name>
value-name: auth
(Opens a editor update value to: null, exit with control + o)

edit <connection-name>
value-name: cipher
(Opens a editor update value to: aes256-gcm, exit with control + o)
```

Check with `print` if the settings are changed.

Note if your OpenVPN log looks something like this it's probably still a mismatch
in cypher, at least in my case it was a typo.

```
Data Channel MTU parms [ mss_fix:1389 max_frag:0 tun_mtu:1500 tun_max_mtu:1600 headroom:136 payload:1768 tailroom:562 ET:0 ]
Outgoing Data Channel: Cipher 'AES-128-GCM' initialized with 128 bit key
Incoming Data Channel: Cipher 'AES-128-GCM' initialized with 128 bit key
Connection reset, restarting [0]
SIGUSR1[soft,connection-reset] received, client-instance restarting
```

Hint: make sure you changed the OPNsense server config to use AES-256-GCM!
