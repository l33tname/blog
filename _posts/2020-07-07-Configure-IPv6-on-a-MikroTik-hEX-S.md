---
published: true
description: Configure IPv6 on my MikroTik hEX S
categories: [blog]
tags: [IPv6, Init7, router, hEX S, MikroTik, network]
layout: post
---


There is this new thing called IPv6.
And with new I mean it is around longer than me.


In the past I used the [Hurricane Electric Free IPv6 Tunnel Broker](https://tunnelbroker.net/) 
to get IPv6 connectivity to my networks.
Because my previous providers didn't had native IPv6.
But this changed since I use Fiber7 by Init7.
They support native IPv6 connectivity and if you [ask](https://www.init7.net/en/support/faq/Statischer-IPv6-Range/) you even get a static IPv6 range.
For free, and thats a great price!


It took forever to configure it on [my Router hEX S](/blog/2020/03/29/hex-s-the-good-the-bad-the-ugly/). 
Because I'm very lazy and not because it is very complicated.

A few facts first, my main interface I use is `pppoe-out1`.
And for this post lets assume the range assigned by Init7 was `2001:XXXX:YYY::/48`.


With all the here is how my configuration looks:

```
/ipv6 dhcp-client add request=prefix pool-name=fiber7 pool-prefix-length=64 interface=pppoe-out1 add-default-route=yes
/ipv6 address add address=2001:XXXX:YYY::1/64 advertise=yes from-pool=fiber7 interface=bridge1 
```


And the firewall configuration I use to protect my router and the hosts in my network:

```
/ipv6 firewall filter
add action=accept chain=input comment="allow established and related" connection-state=established,related
add chain=input action=accept protocol=icmpv6 comment="accept ICMPv6"
add chain=input action=accept protocol=udp port=33434-33534 comment="defconf: accept UDP traceroute"
add chain=input action=accept protocol=udp dst-port=546 src-address=fe80::/16 comment="accept DHCPv6-Client prefix delegation."
add action=drop chain=input in-interface=pppoe-out1 log=yes log-prefix=dropLL_from_public src-address=fe80::/16
add action=accept chain=input comment="allow allowed addresses" src-address-list=allowed
add action=drop chain=input

/ipv6 firewall address-list
add address=fe80::/16 list=allowed
add address=2001:XXXX:YYY::/48  list=allowed
add address=ff02::/16 comment=multicast list=allowed

/ipv6 firewall filter
add action=accept chain=forward comment=established,related connection-state=established,related
add action=drop chain=forward comment=invalid connection-state=invalid log=yes log-prefix=ipv6,invalid
add action=accept chain=forward comment=icmpv6 protocol=icmpv6
add action=drop chain=forward in-interface=pppoe-out1
```

This configuration allows to ping my hosts but nothing else. 
To allow access via `ssh` to some specific hosts I would need to add extra rules.

And last but not least here is how you can test ping google from your router:

```
ping interface=pppoe-out1 address=2001:4860:4860::8844
```


This is mostly based on [Manual:Securing Your Router](https://wiki.mikrotik.com/wiki/Manual:Securing_Your_Router#IPv6). And some other sources I consulted in the process:

* [https://wiki.mikrotik.com/wiki/Manual:IPv6/DHCP_Client](https://wiki.mikrotik.com/wiki/Manual:IPv6/DHCP_Client)
* [https://wiki.mikrotik.com/wiki/Manual:IPv6/Route](https://wiki.mikrotik.com/wiki/Manual:IPv6/Route)
* [https://wiki.mikrotik.com/wiki/Manual:Simple_Static_IPv6_Routing](https://wiki.mikrotik.com/wiki/Manual:Simple_Static_IPv6_Routing)
* [https://forum.netgate.com/topic/96692/pfsense-mit-statischer-ipv6-und-init7](https://forum.netgate.com/topic/96692/pfsense-mit-statischer-ipv6-und-init7)
* [https://michael.stapelberg.ch/posts/2014-08-11-fiber7_ubnt_erlite/](https://michael.stapelberg.ch/posts/2014-08-11-fiber7_ubnt_erlite/)