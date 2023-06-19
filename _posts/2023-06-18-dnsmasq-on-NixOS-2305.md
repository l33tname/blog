---
published: true
description: dnsmasq on NixOS 23.05
categories: [blog]
tags: [dns, NixOS, Linux, dnsmasq, Raspberry Pi]
layout: post
---


This is a small update on the evolved configuration from my 
[Build a simple dns with a Raspberry Pi and NixOS](/blog/2022/11/06/Build-a-dns-server-on-NixOS/) blog post.

I upgraded to 23.05 and learned that i should run `sudo nix-collect-garbage -d` 
from time to time to avoid running out of disk space.

And here is the updated dnsmasq configuration:

```
networking.hostFiles = [(pkgs.fetchurl {
  url = "https://hostname.local/l33tname/hosts/raw/branch/main/hosts";
  sha256 = "14hsqsvc97xiqlrdmknj27krxm5l50p4nhafn7a23c365yxdhlbx";
})];

services.dnsmasq.enable = true;
services.dnsmasq.alwaysKeepRunning = true;
services.dnsmasq.settings.server = [ "85.214.73.63" "208.67.222.222" "62.141.58.13" ];
services.dnsmasq.settings = { cache-size = 500; };
```

As you can see with the latest version some config keys changed slightly.
But the big new thing is that the hosts files is now fetched from my local git server.
This allows me to version and edit this file in a singe place.

Note: The hash [`nix-prefetch-url $url`](https://nixos.org/manual/nix/stable/command-ref/nix-prefetch-url.html) should be updated if the file changes, otherwise NixOS will happily
continue to use the the file fetched last time.
