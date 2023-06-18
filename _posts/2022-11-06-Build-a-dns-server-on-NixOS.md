---
published: true
description: Build a simple dns with a Raspberry Pi and NixOS
categories: [blog]
tags: [dns, NixOS, Linux, dnsmasq, Raspberry Pi]
layout: post
---

You might remember my blog posts from 2016 where I documented my dnsmasq setup.
I run a primary setup on [NetBSD](/blog/2016/07/10/Build-a-dns-server-on-NetBSD/) and a secondary on [Debian](/blog/2016/08/13/Build-a-dns-server-on-Debian/).
(Checkout the linked blog posts if you are interested)

The reasons and use-cases are still the same but this time I gave NixOS a chance since
it was time to upgrade the Debian installation.


It was surprisingly easy after a few start hurdles, where I struggled to get any output on my 4k display.
Using a older 1080p monitor solved that for me.


#### Getting started

Since I used a Raspberry Pi 3 I could use the latest AArch64 image from Hydra (source: <https://nixos.wiki/wiki/NixOS_on_ARM#Installation>).
In my case that was the release-22.05 <https://hydra.nixos.org/job/nixos/release-22.05/nixos.sd_image.aarch64-linux>.

Unpacking and flashing this image to the SD Card works the same as with all other Raspberry Pi images.
Make sure you flash it to the correct device!
```
wget https://hydra.nixos.org/build/197683332/download/1/nixos-sd-image-22.05.3977.f09ad462c5a-aarch64-linux.img.zst
unzstd nixos-sd-image-22.05.3977.f09ad462c5a-aarch64-linux.img.zst
cat unzstd nixos-sd-image-22.05.3977.f09ad462c5a-aarch64-linux.img > /dev/sdX
```

After doing this it should be possible to boot up NixOS for the first time.

#### Basics

Start with generating a basic configuration with:

```
sudo nixos-generate-config
```

Lets add a user and some packages (`vim` and `ping`) which I want to have on my new system.

```
# Define a user account. Don't forget to set a password with ‘passwd’.
users.users.l33tname = {
 isNormalUser = true;
 extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
};

# List packages installed in system profile. To search, run:
# $ nix search wget
environment.systemPackages = with pkgs; [
 vim
 inetutils # ping
];
```


#### Network

The networking is a bit more involved.
I need a static IPv4 and IPv6.
Default routes and DNS server.

Very straight forward after I understood the concept.

```
networking.useDHCP = false;
networking.interfaces.eth0 = {
useDHCP = false;
ipv4.addresses = [
    { address = "192.168.17.7"; prefixLength = 24; }
];
ipv6.addresses = [
    { address = "2001:XXXX:XXXX::7"; prefixLength = 64; }
];
};
networking.defaultGateway = { address = "192.168.17.1"; interface = "eth0"; };
networking.defaultGateway6 = { address = "2001:XXXX:XXXX::1"; interface = "eth0"; };
networking.nameservers = [ "127.0.0.1" "8.8.8.8.8" ];
```

#### Dnsmasq

UPDATE: take a look at the [update configuration](/blog/2023/06/18/dnsmasq-on-NixOS-2305/)
for NixOS 23.05 where i fetch the hosts file from a url.

Last the main event to configure my dnsmasq server the same way I did on my Debian.
And as you can see from the config I just created a `hosts.txt`
file which will be merged with `/etc/hosts`.
(I am thinking about fetching this file from a local webserver or git repo)

```
# List services that you want to enable:
networking.hostFiles = [ /etc/nixos/hosts.txt ];
services.dnsmasq.enable = true;
services.dnsmasq.alwaysKeepRunning = true;
services.dnsmasq.servers = [ "85.214.73.63" "208.67.222.222" "62.141.58.13" ];
services.dnsmasq.extraConfig = "cache-size=500";
```


#### Putting it all together

This gives me a config which looks something like this:

```
{ config, pkgs, ... }:
{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the extlinux boot loader. (NixOS wants to enable GRUB by default)
  boot.loader.grub.enable = false;
  # Enables the generation of /boot/extlinux/extlinux.conf
  boot.loader.generic-extlinux-compatible.enable = true;

  networking.hostName = "nixos"; # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

  # Set your time zone.
  time.timeZone = "Europe/Zurich";

  # Select internationalisation properties.
  i18n.defaultLocale = "en_US.UTF-8";

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.l33tname = {
     isNormalUser = true;
     extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
     vim
     inetutils # ping
  ];

  networking.useDHCP = false;
  networking.interfaces.eth0 = {
    useDHCP = false;
    ipv4.addresses = [
        { address = "192.168.17.7"; prefixLength = 24; }
    ];
    ipv6.addresses = [
        { address = "2001:XXXX:XXXX::7"; prefixLength = 64; }
    ];
  };
  networking.defaultGateway = { address = "192.168.17.1"; interface = "eth0"; };
  networking.defaultGateway6 = { address = "2001:XXXX:XXXX::1"; interface = "eth0"; };
  networking.nameservers = [ "127.0.0.1" "8.8.8.8" ];

  # List services that you want to enable:
  networking.hostFiles = [ /etc/nixos/hosts.txt ];
  services.dnsmasq.enable = true;
  services.dnsmasq.alwaysKeepRunning = true;
  services.dnsmasq.servers = [ "85.214.73.63" "208.67.222.222" "62.141.58.13" ];
  services.dnsmasq.extraConfig = "cache-size=500";


  # Enable the OpenSSH daemon.
  services.openssh.enable = true;
}
```

After that we can build and install this config.
It helps to set a password for the newly created account.

```
sudo nixos-rebuild switch
passwd l33tname
```

After a reboot lets see if everything booted correctly and
you can login over ssh with the new user.

#### Misc

Over all it was a pleasant experience to setup NixOS.
I think to keep it up to date I will run `nixos-rebuild switch --upgrade` from time to time.

A thing I used a bunch is the options search from NixOS at:
<https://search.nixos.org/options> to read the docs for config keys or
finding the correct config key.

Last but not least I want to point to these four resources which helped me to understand how to configure my system.

- <https://nix.dev/tutorials/installing-nixos-on-a-raspberry-pi>
- <https://schauderbasis.de/posts/install_nixos_on_raspberry_pi_4/>
- <https://dn42.eu/howto/nixos>
- <https://skogsbrus.xyz/blog/2022/06/12/router/>
