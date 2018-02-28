---
published: true
description: How to use HiDPI Displays
categories: [blog]
tags: [Fedora, i3, XServer, HiDPI, Dell XPS 13]
layout: post
---

Aparently it is to hard to ship default configuration that works with HiDPI displays.
And my Dell XPS 13 has a HiDPI display. But fear not it's not that hard to configure 
when you know which files you should change. So here is what is working for me with i3 
as window manager. (This should works probably for everything which uses the XServer)


The first file we need is `~/.Xresources`

```
Xft.dpi: 192
Xft.autohint: 0
Xft.lcdfilter:  lcddefault
Xft.hintstyle:  hintfull
Xft.hinting: 1
Xft.antialias: 1
Xft.rgba: rgb
```

I think not all options are really needed.


And to get `~/.Xresources` loaded you need the `~/.xinitrc` file.

```
xrdb -merge ~/.Xresources
```

This is btw part of my [dotfiles]( https://github.com/fliiiix/dotfiles/ ).
