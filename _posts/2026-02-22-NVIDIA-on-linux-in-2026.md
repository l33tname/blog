---
published: true
description: NVIDIA on linux in 2026
categories: [blog]
tags: [fedora, wayland, NVIDIA, sway]
layout: post
---

NVIDIA in 2026 how bad is it?
Spoiler it's not great.
We all know and love the [Linus Torvalds Fuck you NVIDIA clip (2012)](https://youtu.be/MShbP3OpASA?si=GcH5bN8jO0iySSXY&t=2997) but how bad is it these days?

I decided to try it again with my latest Fedora 43 installation.
Before people ask why I even bought a NVIDIA card instead of AMD,
the long story short is I got it almost for free
and I didn't think much about it.
(It's a GeForce GTX 980)

Last time around I stuck with the [nouveau](https://nouveau.freedesktop.org/) driver which is the open source
implementation of a NVIDIA driver.
This works well enough for me to render a browser and some terminals.
I don't have high needs and expectations for my graphic cards.
The main problem for me is that after years it does not seem to have
and controls for the fans so they spin at 100% all the time and make a
lot of noise.

### The install

To install the drivers I followed the [NVIDIA on Fedora desktops](https://github.com/Comprehensive-Wall28/Nvidia-Fedora-Guide?tab=readme-ov-file) guide.
Which is just these few commands since there is no secure boot on this system:

```
sudo dnf update
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm


sudo dnf install akmod-nvidia
sudo dnf install xorg-x11-drv-nvidia-cuda

# wait here until the module is built (the command should show a version)
modinfo -F version nvidia

# reboot
```

### Sway

Since I run sway there are a few more tweaks needed.
The wiki states: "The NVIDIA proprietary driver isn't officially supported here" [source](https://github.com/swaywm/sway/wiki#nvidia-users).
Support is not great.

I added an `/etc/sway/environment` file as recommended by the guide above.

```
SWAY_EXTRA_ARGS="$SWAY_EXTRA_ARGS --unsupported-gpu"
WLR_NO_HARDWARE_CURSORS=1
```

In addition I needed [sway-nvidia](https://github.com/crispyricepc/sway-nvidia).

```
git clone https://github.com/crispyricepc/sway-nvidia
sudo install -Dm755 sway-nvidia/sway-nvidia.sh "/usr/local/bin/sway-nvidia"
sudo install -Dm644 sway-nvidia/sway-nvidia.desktop "/usr/share/wayland-sessions/sway-nvidia.desktop"
sudo install -Dm644 sway-nvidia/wlroots-env-nvidia.sh "/usr/local/share/wlroots-nvidia/wlroots-env-nvidia.sh"
```

After that I was able to select `Sway (NVIDIA)` from the login screen
and boot successfully into sway with the proprietary NVIDIA drivers.

One interesting side effect of the driver changes was that I needed to
run a `sudo flatpak update` and a re-login before things like Signal
started to work again.

### Conclusion

In conclusion: don't get NVIDIA graphic cards in 2026
if you want to run linux.
The open source driver is still not ideal and
the proprietary route is not any better.
(Both got significant better and simpler to use since I tried this experiment ~4-5 years ago.)
