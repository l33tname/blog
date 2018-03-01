---
published: true
description: How to use HiDPI Displays
categories: [blog]
tags: [Fedora, i3, XServer, HiDPI, Dell XPS 13]
layout: post
---

Apparently it is too hard to ship with a default configuration, that works well with HiDPI displays.
And my Dell XPS 13 has a HiDPI display. But fear not, it's not that hard to configure 
when you know which files you should change. So here is what's working for me with [i3](https://i3wm.org) 
as window manager. (This should probably work for everything using XServer.)


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

I don't think all these options are needed, but as I said, _works for me™️_.


To finally get `~/.Xresources` loaded you need the `~/.xinitrc` file.

```
xrdb -merge ~/.Xresources
```

Btw: this is also part of [my dotfiles]( https://github.com/fliiiix/dotfiles/).
