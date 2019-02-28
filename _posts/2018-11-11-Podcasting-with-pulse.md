---
published: true
description: The PulseAudio setup to stream to icecast
categories: [blog]
tags: [pulse, PulseAudio, stream, icecast, darkice]
layout: post
---

The goal is to create a simple solution to live stream a podcast.
This means I need a audio stream which combines the thing I hear and the 
things I say. 

To achieve this I mostly copied what [makefu](https://euer.krebsco.de/podcasting-with-pulse.html) 
does. The first step is to figure out what the name of your input and output device is.
You can find that with:

```
pacmd list-sources | grep -e device.string -e 'name:'
```

Which will provide you with output like this:

```
	name: <alsa_output.pci-0000_00_1b.0.analog-stereo.monitor>
		device.string = "0"
	name: <alsa_input.pci-0000_00_1b.0.analog-stereo>
		device.string = "front:0"
	name: <alsa_output.pci-0000_01_00.1.hdmi-stereo-extra1.monitor>
		device.string = "1"
	name: <alsa_output.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.monitor>
		device.string = "2"
	name: <alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo>
		device.string = "front:2"
```

As we can see here my output device is: `alsa_output.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.monitor` and my input device is `alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo`.

Now my problem is that my input device is stereo but my microphone only records in mono. But this is 
easy to fix, we can just remap our input to mono like this:

```
pactl load-module module-remap-source master=alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo master_channel_map=front-left,front-right channels=2 channel_map=mono,mono
```

If we check the list of devices again we have a new input device called `alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.remapped`. And this will be the input device we use.


Now we can just create a new stream and map input and output to it:

```
# create stream
pactl load-module module-null-sink sink_name=stream sink_properties=device.description="Streaming"

# map input and output
pactl load-module  module-loopback source=alsa_output.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.monitor sink=stream latency_msec=1
pactl load-module  module-loopback source=alsa_input.usb-Focusrite_Scarlett_Solo_USB-00.analog-stereo.remapped sink=stream latency_msec=1
```

The only thing left is to have a [darkice](http://www.darkice.org/) which is compiled with mp3 support and then you can stream 
to any [icecast](http://icecast.org/) server like this:

```
darkice -c stream.cfg
```

My config looks like this:

```
[general]
duration = 0
bufferSecs = 5
reconnect = yes
realtime = no
rtprio = 2

[input]
sampleRate = 44100
bitsPerSample = 16
channel = 2
device = pulseaudio
paSourceName = stream.monitor

[icecast2-0]
format=mp3
channel=2
bitrate=128
bitrateMode=cbr
quality=0.6
server=dns.name.or.ip.of.your.icecast.server
name=Testi test
description=Test test
public=yes
localDumpFile=dump.mp3
mountPoint=your_mountpoint.mp3
password=XXXXX
port=9000
```

And thats it, happy streaming!
