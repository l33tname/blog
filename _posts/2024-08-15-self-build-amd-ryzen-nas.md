---
published: true
description: Self build AMD Ryzen NAS
categories: [blog]
tags: [NAS, 10GbE, supermicro, SC721TQ-250B, AMD, Ryzen, AsRock X570D4i-2t, AsRock]
layout: post
---

It is almost 5 years after building my [Xeon D NAS](/blog/2019/03/23/self-build-xeon-d-nas/),
and my [Dell T20] started to fail.
(Well actually as it turned out just the RAM was failing, the rest is still fine)

And here is what I ended up with this round:

- [AsRock X570D4i-2t](https://www.asrockrack.com/general/productdetail.asp?Model=X570D4I-2T#Specifications)
- AMD Ryzen 5 4500 AM4, 3.60 GHz, 6 Core
- Corsair Vengeance 2 x 32GB, 3200 MHz, DDR4-RAM, SO-DIMM
- Case: Supermicro SC721 TQ-350B2


I was looking for something new with AMD since the Intel boards I seen where less exciting the last few years.
The AsRock X570D4i-2t comes with 10GbE, is mini-ITX sized and takes AM4 socket CPUs.
It can even handle up to 128GB memory which is great since 24GB was not enough to build my FreeBSD packages.
I took the same Supermicro case since I was very happy with it the first time around as it provides space for 4 hot swappable HDDs.
And the form factor is great and it contains already a power supply.
I debated to build a only nvme based NAS but I guess that's and idea for later.


Let's talk about the things I learned/hated.
Starting with minor things: OCuLink is an interesting connector and since I was not sure
if an OCuLink to SATA adapter is part of the mainboard I went ahead and ordered one.
During that I found out that it is not that popular and kinda hard to buy.
I think OCuLink is cool from a technical aspect and is easy to use,
but annoying to buy since it is not wide spread yet.


You might have spotted the 8pin(DC-IN)+4pin(ATX) in the specs for the power connector.
This was supper unclear to me and even with the documentation provided in paper form it was not mentioned.
I needed to consult the [full documentation](https://download.asrock.com/Manual/X570D4I-2T.pdf)
where on page 25 we can find a drawing for it.
Apparently for 12V you could connect one 8 pin connector, but for a normal ATX you need to connect one 4 pin into
the 8 pin connector and an other 4 pin for CPU.
In the end I'm just happy I didn't fry my mainboard by trying to connect power to this board.


Things getting worse: I own now 3 CPU coolers for this CPU.
The first one is the stock fan which came with the CPU and I had intended to use it.
When starting assembling it became clear that this will not fit and I need a LGA115x fan.
Fair enough I missed that the first time I looked at the specs.
I got one from aliexpress because it is supper hard to find coolers for LGA115x.
A week later when I tried to install this fan I learned that only some LGA115x will
work or I would need to remove the already installed backpannel for the cooler.
This at least to me is the worst design decision by ASRock not to go for a standard cooler mount.
I ended up with [Cooler Master I30 I50 I50c MINI CPU Cooler 2600 RPM Quiet Fan For Intel LGA115X 1200 And M-ATX Radiator](https://www.aliexpress.com/item/1005005958984493.html).
Good news is a lot of people talk about overheating issues as far as my few day testing showed,
this case and the fan do a good job to keep things cool.


Last but not least I'm not sure who's fault this is but the case front panel connector does not match the mainboard's
System and Auxiliary Panel and I needed to resort to connect these two components manually.
Meaning I needed to first find the documentation for the case which was harder than expected.
It is not in the [manual for my case](https://www.supermicro.com/manuals/chassis/Mini-tower/SC721.pdf).
I needed to resort to looking up a mainboard which uses this connector and search for it there.
Luckily the [X10SDV Mini-ITX Series](https://www.supermicro.com/manuals/motherboard/D/MNL-1726.pdf)
documentation contains a the pin layout.
Apparently this thing is called JF1 and the manual contained infos on how to connect.

Here is how it looks:

![self build connector between JF1 and AMD System Panel](/blog-bilder/2024-08-15-self-build-amd-ryzen-nas.jpeg)

In summary it runs now for a few days and I'm slowly making sure it runs
all the things I need mainly [backup](/blog/2023/01/28/Pull-ZFS-Backup/) and
[building FreeBSD packages](/blog/2017/05/25/Poudriere/).
And I can report that everything runs smoothly and the extra CPU and Memory help to build my packages faster.
In addition a lot of people online had problems with heat, which is something I did not observe yet, everything runs cool.
