---
published: true
description: Debugging the Nokia Streaming box 8000
categories: [blog]
tags: [Nokia Streaming box 8000, uart, screen, hardware, Android TV]
layout: post
---

I recently looked at a Nokia Streaming box 8000 which seemed to stuck in a boot loop.
(It's a surprisingly expensive? Android TV box)
My assumption was that a recent software update broke the system so my first course of action was
to reset the unit and see if that fixes the issue.

The reset button is at the bottom and kind of what you would expect:

> Perform a HARD Reset of your Nokia Streaming Box. In order to perform the HARD Reset,
> a paper clip or a similar object is needed (for example, a SIM Card ejector can also work).
> While the Power Cable is disconnected, please press the RESET button, which is situated on the bottom
> of the Nokia Streaming Box 8000 and keep it pressed.
> While you are keeping the RESET button pressed, please connect the POWER plug and then release the RESET button.

[source](https://streamview.com/faqs/)

After that it stopped booting completely and I just assumed the hardware was broken.
With a bit of googling I found a [reddit thread](https://www.reddit.com/r/AndroidTV/comments/1ho77d2/nokia_streaming_box_8000_not_powering_on/)
talking about a uart which peaked my interest.

Prying open the device was something I didn't enjoy much but the devices does not have any screws for the case.
And the way in is to pry it open it has 2 taps on the front see this picture of the bottom.
Use the reset hole to orientate yourself.

![bottom plate Nokia Streaming box 8000](/blog-bilder/2026-06-16-bottom-plate.jpeg)


The good news is I think you are already done I toke it fully out which also takes a little bit more force than I
was comfortable with because it sticks to a thermal pad.
But you can access the uart from the back unfortunately its not labeled there.
I took the [picture from the reddit thread]( https://imgur.com/a/nokia-streaming-box-8000-k7xzPis ) and labeled them for you.

![uart labeled from the back](/blog-bilder/2026-06-16-serial-back-label.jpeg)

Take your favorite USB Serial TTL and connect ground to ground and don't forget that you need to cross TX/RX.
Meaning TX from the USB adapter goes to RX on the board.
I didn't even bother to solder it on I just stuck some cables in at an angle so they made contact which was enough.
This allows to see the boot process and diagnose your unit.
I used `screen /dev/ttyUSB1 115200` (depends a bit on your Serial TTL adapter usual something like `ttyUSB*` or `ACM*`) but any serial tool will work.

In my case it seems the provided power supply (which is 12V and 1 amp) did not provide enough
power after switching that to a 1.5 amp unit everything started to work again.
Thanks random reddit user for saving this box from e-waste.
Hopefully it runs a few more years.
