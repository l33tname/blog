---
published: true
description: How to use emojis on linux
categories: [blog]
tags: [i3, rofi, unicode, emoji, linux, xclip]
layout: post
---

2019 is the year of Linux on the desktop 🎉! Or something.

We all know to be a successful platform you need to have 
emojis. And who can hate emojis, they are the best.

So here is how you get a simple way to use emojis and other
special characters on Linux (with i3 and rofi). It was 
surprisingly easy (probably because I mostly just stole it from
[entiPi](https://github.com/entiPi/.dotfiles/commit/42a339aa8da11b8a4662f069d0fe734d793e763f)).


You need two programs to get started `rofi` to display the menu and `xclip`
to put characters in your X selection buffer to paste it. My keyboard shortcut 
is `Win` + `u` for unicode. And it looks like this in my i3 config:

```
bindsym $mod+u exec --no-startup-id rofi -lines 10 -dmenu -input ~/.symbols.txt | cut -d' ' -f1 -z | xclip -selection c
```

![Rofi unicode menu](/blog-bilder/2019-01-27-Unicode-magic-on-linux.png)


As you can see it takes the character from the `.symbols.txt` file. The format is simple
it is just 'character' 'name' 'category'. Checkout a example symbols file from 
[github](https://github.com/fliiiix/dotfiles/blob/master/config/configuration/symbols.txt)

```
☮ peace symbol                                               	 Miscellaneous Symbols
```

Now you can search for the character and press enter to add it to the X selection buffer
and paste it where ever you want (Terminal, Pull Request, Email, etc.).


👍 Have fun with unicode 👍
