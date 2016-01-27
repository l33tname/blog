+++
date = "2014-11-11T00:00:00Z"
title = "Fun with SOCKS"
description = "Access your LAN through socks with a browser"
tags = ["PAC", "SOCKS", "Firefox", "FoxyProxy", "AutoProxy", "Network"]
url = "/2014/11/11/fun-with-socks/"

+++

Fun with SOCKS proxy's

Sometimes you are not at home, but you want access to your local systems
with DNS and everything.
And guess what, it's possible. The only thing you need is a dyndns setup or
a static IP or and a open port for ssh.

Additionally you need a ssh server in your network, I recommend to
configure this server to key based login only or at least with 2 factor
authentication.

I personally like to setup my host in the ssh config file something like
this:

```
Host hostname
    Hostname my.dyndns.example
    Port 3333
    User myuser
    IdentityFile ~/.ssh/myprivatkey
```

With this in place you can now easily open a SOCKS proxy

```
ssh -4 -Nn -D 1080 hostname
```

This opens a SOCKS proxy on your localhost:1080 which tunnels your traffic
through your host in your home network.
To test this you can configure this in your Firefox. Options -> Advanced ->
Network -> Settings... there you can set your SOCKS Host and port. Now your
ready to got, just browse to a site in your local network.

# Special Firefox settings
Since you proxy all your traffic through your SOCKS proxy you probably
didn't want to leak your DNS query's, so just set
`network.proxy.socks_remote_dns` to true. (you find it in about:config) 
I set this always on true because I run a DNS server in my home network.

# AutoProxy (not working for me in latest Firefox)
But now all your traffic goes through your home network, depending on your
internet connection this is maybe a bit slow.

So there are Firefox plugins which allow you to set rules when which proxy
is used. On of this plugins is [FoxyProxy](http://getfoxyproxy.org/). The
problem with this is you need a paid pro version to configure rules for IP
addresses. So I tried [AutoProxy](https://autoproxy.org) instead.
And with AutoProxy it's simple to configure 2 rules, one for my local
domain and one for my IP range.

![AutoProxy settings](/blog-bilder/2014-11-11-fun-with-socks-auto-proxy.png)

# PAC files to the rescue

Since AutoProxy stopt working I need a new solution. And guess what
it's really simple. Most browser have the ability to use [PAC](http://en.wikipedia.org/wiki/Proxy_auto-config) files. 


And here is mine: 

```
$ cat setup.pac
//alerts are in ctrl + shift + j
function FindProxyForURL(url, host)
{
  if(shExpMatch(host, "*.l33t.lan*") || shExpMatch(host, "192.168.1.*"))
  {
    return "SOCKS 127.0.0.1:1080";
  }

  // The default case
  return "DIRECT";
}
``` 

Just configure your Firefox to use it (don't forget to restart your browser). You just use the file path:

![Set a PAC file](/blog-bilder/2014-11-11-fun-with-socks-pac.png)

Options -> Advanced -> Network -> Settings...

Now all request for my subnet 192.168.1.0/24 and my domain l33t.lan are
going through the SOCKS proxy and the rest using as before no proxy. The
best from both worlds.
