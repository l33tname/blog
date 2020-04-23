---
published: true
description: OPNsense to MikroTik site-to-site tunnel
categories: [blog]
tags: [router, OpenVPN, OPNsense, hEX S, MikroTik, apu, network]
layout: post
---

This is how I configured my OpenVPN site-to-site tunnel between a [MikroTik hEX S](https://l33tsource.com/blog/2020/03/29/hex-s-the-good-the-bad-the-ugly/)
and my [apu4c2]( https://www.pcengines.ch/apu4c2.htm) running [OPNsense](https://opnsense.org/).

The setup looks something like this:
```
                                +--------------+
                                |              |
                            +-->+ The Internet +<-+
                            |   |              |  |
                            |   +--------------+  |
                            |                     |
                            |                     |
                            |                     |
                            |                     |
+---------------------------+--+             +----+------------------------------+
| Opensense (acting as server) |             | MikroTik hEX S (acting as client) |
|                              |             |                                   |
| IP: 192.168.1.0/24           |             | IP: 192.168.2.0/24                |
| DDNS: opnsense.example.com   |             | DDNS: mikrotik.example.com        |
+------------------------------+             +-----------------------------------+
```

## OPNsense server configuration

Lets start to setup the OPNsense part which will act as a server.

### Certificate

First we need to create certificates under `System > Trust > Authorities`.
There we can create a new CA to self signed certificates for your sever and client.
With the new CA we can create 2 certificates in `System > Trust > Certificates`.


The first certificate we create is the on for the OpenVPN server.
The important options are:
```
The options for the server cert:
Methode: Create an internal Certificate
Certificate authority: the one you just created
Type: Server Certificate
Common Name: opnsense.example.com
```

The second certificate we will create is the client certificate.
The important options are:
```
Methode: Create an internal Certificate
Certificate authority: the one you just created
Type: Client Certificate
Common Name: mikrotik.example.com
```

-> Use the export as .p12 format we will use this later!

### OpenVPN server

The next step is to setup a OpenVPN sever.
Luckily for us OPNsense provides OpenVPN out of the box.
So we just go to `VPN > OpenVPN > Servers` and configure a OpenVPN server.


The important options are:
```
Server Mode: Peer to Peer (SSL/TLS)
Protocol: TCP
Peer Certificate Authority: the CA you created
Server Certificate: the server cert
Encryption algorithm: AES-256-CBC (256 bit key, 128 bit block)
Auth Digest Algorithm: SHA1 (160-bit)
IPv4 Tunnel Network: 10.0.8.0/24 (or a other unused IP range)
IPv4 Local Network: 192.168.1.0/24
IPv4 Remote Network: 192.168.2.0/24
Compression: No Preference
```


The last thing is to ensure that OpenVPN creates a internal route.
Without this OpenVPN would drop the packages coming from our client.
(see [OpenVPN FAQ](https://openvpn.net/faq/multi-bad-source-address-from-client-packet-dropped-or-get-inst-by-virt-failed/))


To do this we need to create a client specific override in `VPN > OpenVPN > Client Specific Overrides`.

The important options are:
```
Common name: mikrotik.example.com (needs to match your client certificate)
IPv4 Local Network: 192.168.1.0/24
IPv4 Remote Network: 192.168.2.0/24
```


Last but not least you need to think about the firewall settings.
You need a rule that allows traffic on your wan interface on the OpenVPN server port for TCP.
And by default all traffic from OpenVPN would be dropped,
so you need a similar rule like on your LAN interface,
where you allow all traffic or create specific rules for your site to site connection.


## MikroTik client configuration

If you haven't already download the client certificate as .p12.
Why? So disappointing. But you can still do that on your OPNsense in `System > Trust > Certificates`.

### OpenVPN client

Now we can import the client certificate.
To do this you need to upload it to `Files`.
And then it is available in `System > Certificates` where you can click Import and select it.
After that you should have 2 new certificates in `System > Certificates`
ending in p12_0 and p12_1. (You can rename them if you want)

With that out of the way we can configure in `PPP` our OpenVPN client.

Click on `Add New > OVPN Client`.

The important options are:
```
Connect To: opnsense.example.com
User: (doesn't matter but can not be empty)
Certificate: (the one with .p12_0)
Auth: sha1
Cipher: aes 256
```

## Logs & Debugging

No matter how hard I try usually something is not working.
This is why this section exist.
This are a few tips how to figure out why and what is not working in this setup.

### MikroTik

By default there are not may logs.
To enable debug logs:

```
/system logging add topics=ovpn,debug
```

### OPNsense

And on server side I like to run the process by hand to see all output directly on stdout.
To do that we need to be root.
To find the correct process we can do this:

```
# ps aux | grep openvpn
root     61373   0.0  0.3 1061388  6192  -  Ss    7Mar20     0:50.15 /usr/local/sbin/openvpn --config /var/etc/openvpn/client2.conf
root     79177   0.0  0.4 1061388  7152  -  Ss   22:33       0:08.81 /usr/local/sbin/openvpn --config /var/etc/openvpn/server3.conf
```

As you can see I have 2 OpenVPN processes running but only on of the is
started with a server config to this is the process which I'm interested in.
Now that we know that our config file is `/var/etc/openvpn/server3.conf`,
we can stop the OpenVPN server in the UI.
Open the config file and remove the line `daemon` in the config file.

Now we are ready to start the process by hand:

```
/usr/local/sbin/openvpn --config /var/etc/openvpn/server3.conf
```

This way you see all logs on the console instant.


## Versions

These are the versions I used at the time of writing this post.

OPNsense:
```
OPNsense 20.1.2-amd64
FreeBSD 11.2-RELEASE-p17-HBSD
LibreSSL 3.0.2
```

MiroTik hEX S:
```
RouterOS v6.45.8 (long-term)
```

## Thanks

And a special thanks to [@gmanual](https://medium.com/@gmanual/pfsense-mikrotik-openvpn-site-to-site-b001c105843c),
who created a similar setup with pfSense.
And to [lewish](https://github.com/lewish) for creating [asciiflow](http://asciiflow.com/).
