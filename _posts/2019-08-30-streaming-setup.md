---
published: true
description: Streaming with darkice
categories: [blog]
tags: [pulse, PulseAudio, stream, icecast, darkice, Fedora, Fedora 30]
layout: post
---

This is an continuation of [Podcasting With Pulse](/blog/2018/11/11/Podcasting-with-pulse/).

## Building darkice

Years ago when I first compiled darkice it was complicated to get
it compiled and running with mp3 support. 

Amazingly darkice still exists and it's easier than ever to compile 
it with mp3 support.

The first step is to get the latest (darkice-1.4.tar.gz) version
from [www.darkice.org](http://www.darkice.org/). And unpack it.

```
tar xf ~/Downloads/darkice-1.4.tar.gz -C .
```

And to get it with mp3 support just install the headers.

```
sudo dnf install lame-devel
```

And then build it. 
(Make sure you see something like `checking for lame library at /usr ... found at /usr` on configure)

```
./configure
make
make install
```

## Start a stream

And to make life even simpler I created 2 scripts to setup the interfaces and start the stream.


setup-stream.sh
```
#!/bin/sh

pactl load-module module-remap-source master=alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo master_channel_map=front-left,front-right channels=2 channel_map=mono,mono

pactl load-module module-null-sink sink_name=stream sink_properties=device.description="Streaming"

pactl load-module  module-loopback source=alsa_output.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.monitor sink=stream latency_msec=1
pactl load-module  module-loopback source=alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.remapped sink=stream latency_msec=1

```


start-stream.sh
```
#!/bin/sh

darkice -c stream.cfg
```

Now podcasting is just:

```
./setup-stream.sh
./start-stream.sh
```
