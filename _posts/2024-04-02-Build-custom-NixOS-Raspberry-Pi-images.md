---
published: true
description: Build custom NixOS Raspberry Pi images
categories: [blog]
tags: [NixOS, Linux, Fedora, Raspberry Pi, binfmt]
layout: post
---

Since you might be not interested in me hating NixOS, Linux and the world in general i put
my little rant at the end of this article.
The first part is how to cross build a NixOS image for a Raspberry Pi 3 B+ from Fedora.
I used [compiling through binfmt QEMU]( https://wiki.nixos.org/wiki/NixOS_on_ARM#Compiling_through_binfmt_QEMU ).
My Fedora laptop is a x86 system and we need to build a AArch64 image.

I assume that nix is already installed and binfmt is installed and works.
And spoiler / warning no idea if that is proper or a good way to do it,
it is just the way that worked for me.

```
$ nix --version
nix (Nix) 2.15.1

$ ls /proc/sys/fs/binfmt_misc/ | grep aarch64
qemu-aarch64

$ systemctl status systemd-binfmt.service
```

We need to configure nix to use this.
For this I added the following config to `/etc/nix/nix.conf`.

```
extra-platforms = aarch64-linux
extra-sandbox-paths = /usr/bin/qemu-aarch64-static
```

After that we need to restart the nix daemon.

```
$ systemctl restart nix-daemon.service
```

After that we are ready to create the config file:

```
$ cat configuration.sdImage.nix
{ config, pkgs, lib, ... }:
{
  nixpkgs.overlays = [
    (final: super: {
      makeModulesClosure = x:
        super.makeModulesClosure (x // { allowMissing = true; });
    })
  ];
  system.stateVersion = lib.mkDefault "23.11";

  imports = [
    <nixpkgs/nixos/modules/installer/sd-card/sd-image-aarch64.nix>
  ];

  nixpkgs.hostPlatform.system = "aarch64-linux";
  sdImage.compressImage = false;

  # NixOS wants to enable GRUB by default
  boot.loader.grub.enable = false;
  # Enables the generation of /boot/extlinux/extlinux.conf
  boot.loader.generic-extlinux-compatible.enable = true;

  # Set to specific linux kernel version
  boot.kernelPackages = pkgs.linuxPackages_rpi3;

  # Needed for the virtual console to work on the RPi 3, as the default of 16M doesn't seem to be enough.
  # If X.org behaves weirdly (I only saw the cursor) then try increasing this to 256M.
  # On a Raspberry Pi 4 with 4 GB, you should either disable this parameter or increase to at least 64M if you want the USB ports to work.
  boot.kernelParams = ["cma=256M"];

  # Settings
  # The rest of your config things

  # Use less privileged nixos user
  users.users.nixos = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" "video" ];
    # Allow the graphical user to login without password
    initialHashedPassword = "";
  };

  # Allow the user to log in as root without a password.
  users.users.root.initialHashedPassword = "";
}
```

The `overlays` are quite important as there is some [issue]( https://github.com/NixOS/nixpkgs/issues/154163 )
which I don't fully understand.
If not added the error looks something like this where a kernel module was not found:

```
modprobe: FATAL: Module ahci not found in directory /nix/store/8bsagfwwxdvp9ybz37p092n131vnk8wz-linux-aarch64-unknown-linux-gnu-6.1.21-1.20230405-modules/lib/modules/6.1.21
error: builder for '/nix/store/jmb55l06cvdpvwwivny97aldzh147jwx-linux-aarch64-unknown-linux-gnu-6.1.21-1.20230405-modules-shrunk.drv' failed with exit code 1;
       last 3 log lines:
       > kernel version is 6.1.21
       > root module: ahci
       > modprobe: FATAL: Module ahci not found in directory /nix/store/8bsagfwwxdvp9ybz37p092n131vnk8wz-linux-aarch64-unknown-linux-gnu-6.1.21-1.20230405-modules/lib/modules/6.1.21
       For full logs, run 'nix log /nix/store/jmb55l06cvdpvwwivny97aldzh147jwx-linux-aarch64-unknown-linux-gnu-6.1.21-1.20230405-modules-shrunk.drv'.
error: 1 dependencies of derivation '/nix/store/ndd1yhiy68c2av64gwn8zfpn3yg07iq5-stage-1-init.sh.drv' failed to build
error: 1 dependencies of derivation '/nix/store/j2gmvl3vaj083ww87lwfrnx81g6vias2-initrd-linux-aarch64-unknown-linux-gnu-6.1.21-1.20230405.drv' failed to build
building '/nix/store/vs0cg5kzbislprzrd3ya16n1xd532763-zfs-user-2.1.12-aarch64-unknown-linux-gnu.drv'...
error: 1 dependencies of derivation '/nix/store/gjhfjh9bb3ha0v03k7b4r3wvw4nxm7r3-nixos-system-aegaeon-23.11pre493358.a30520bf8ea.drv' failed to build
error: 1 dependencies of derivation '/nix/store/x5mnb1xfxk7kp0mbjw7ahxrz2yiv922s-ext4-fs.img-aarch64-unknown-linux-gnu.drv' failed to build
error: 1 dependencies of derivation '/nix/store/8qbjy9mnkrbyhj4kvl50m8ynzpgwmrpz-nixos-sd-image-23.11pre493358.a30520bf8ea-aarch64-linux.img-aarch64-unknown-linux-gnu.drv' failed to build
```

Don't forget to add your customization after `# Settings`.
This is the place where you setup your user, enable required services,
configure networking.
In my case that's where most of the config is from this blog post: [Build a simple dns with a Raspberry Pi and NixOS](/blog/2022/11/06/Build-a-dns-server-on-NixOS/).

After that we can build (this takes some time!) and flash the image.

```
nix-build '<nixpkgs/nixos>' -A config.system.build.sdImage -I nixos-config=./configuration.sdImage.nix --option sandbox false --argstr system aarch64-linux
```

and

```
sudo -s
cat /path/to/img > /dev/sdX
```

### The Rant

Why am I building a image myself instead of using the official image and just do what
i have written in my earlier blog post [Build a simple dns with a Raspberry Pi and NixOS](/blog/2022/11/06/Build-a-dns-server-on-NixOS/).
And the answer to that is part of my rant somehow NixOS is not able to upgrade / build on 23.11
on a Raspberry Pi it crashes for my either while downloading some packages or with some pid that
either deadlocks or hangs for longer than i was willing to wait (more than 6 hours).


After I decided to try to cross build it was a real struggle to figure out how to do that.
There are a lot of resources:

* <https://wiki.nixos.org/wiki/NixOS_on_ARM#Compiling_through_binfmt_QEMU>
* <https://github.com/hugolgst/nixos-raspberry-pi-cluster/tree/master>
* <https://eipi.xyz/blog/installing-nixos-on-a-rasberry-pi-3/>
* <https://discourse.nixos.org/t/cross-building-for-aarch64-with-nix-on-a-non-nixos-fedora-39-machine-wont-use-the-cache/35398/4>
* <https://wiki.nixos.org/wiki/Linux_kernel>
* <https://github.com/lucernae/nixos-pi/tree/main>
* <https://myme.no/posts/2022-12-01-nixos-on-raspberrypi.html>
* <https://wiki.nixos.org/wiki/NixOS_on_ARM/Raspberry_Pi>
* <https://wiki.nixos.org/wiki/Overlays>

And a lot of them are not well structured or outdated.
Which makes it very hard for a beginner like me to figure out where to start.


But with all this ranting i also want to point out that it seems like most
NixOS user want to help you out.
Thanks [makefu](https://github.com/makefu/) for answering all my stupid NixOS questions
and [nova for pointing me to the correct github issue](https://discourse.nixos.org/t/does-pkgs-linuxpackages-rpi3-build-all-required-kernel-modules/42509/2?u=l33tname).
