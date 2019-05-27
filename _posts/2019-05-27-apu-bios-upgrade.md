---
published: true
description: APU3 BIOS upgrade
categories: [blog]
tags: [bios, apu3, apu, HBSD, FreeBSD, OPNsense, flashrom, dmidecode]
layout: post
---

I read [How to enable Core Performance Boost on AMD platforms?](https://blog.3mdeb.com/2019/2019-02-14-enabling-cpb-on-pcengines-apu2/).
Which lead me to the question did I upgrade my apu board bios.
And the answer is a conclusive maybe.


So here are the steps to upgrade a apu board bios
on [OPNsense](https://opnsense.org/) (or basically every FreeBSD).
To check the current bios version there is a tool called `dmidecode`.

```
# dmidecode -t bios
Scanning /dev/mem for entry point.
SMBIOS 2.7 present.

Handle 0x0000, DMI type 0, 26 bytes
BIOS Information
	Vendor: coreboot
	Version: v4.9.0.3
	Release Date: 03/08/2019
	ROM Size: 8192 kB
	Characteristics:
		PCI is supported
		PC Card (PCMCIA) is supported
		BIOS is upgradeable
		Selectable boot is supported
		ACPI is supported
		Targeted content distribution is supported
	BIOS Revision: 4.9
	Firmware Revision: 0.0
```

The next step is to check [https://pcengines.github.io/](https://pcengines.github.io/)
for new bios versions.
Now it is very important to download the correct bios version which matches
your hardware version.

And then just one flashrom command is needed (this needs root permissions):

```
# pkg install flashrom
# fetch https://3mdeb.com/open-source-firmware/pcengines/apu3/apu3_v4.9.0.5.rom
# flashrom -w apu3_v4.9.0.5.rom -p internal
flashrom v1.0 on FreeBSD 11.2-RELEASE-p9-HBSD (amd64)
flashrom is free software, get the source code at https://flashrom.org

Using clock_gettime for delay loops (clk_id: 4, resolution: 2ns).
coreboot table found at 0x7eed0000.
Found chipset "AMD FCH".
Enabling flash write... OK.
Found Winbond flash chip "W25Q64.V" (8192 kB, SPI) mapped at physical address 0x00000000ff800000.
Reading old flash chip contents... done.
Erasing and writing flash chip... Erase/write done.
Verifying flash... VERIFIED.
```

Now you can reboot and enjoy your new bios!

A common issue is that the the mainboard tag does not match
the tag in the rom file:


```
This coreboot image (PC Engines:apu3) does not appear to
be correct for the detected mainboard (PC Engines:PCEngines apu3).
Aborting. You can override this with -p internal:boardmismatch=force.
```

If that happens make sure you downloaded the right rom file and then force it:

```
# flashrom -w apu3_v4.9.0.3.rom -p internal:boardmismatch=force
flashrom v1.0 on FreeBSD 11.2-RELEASE-p9-HBSD (amd64)
flashrom is free software, get the source code at https://flashrom.org

Using clock_gettime for delay loops (clk_id: 4, resolution: 2ns).
coreboot table found at 0x77fae000.
Found chipset "AMD FCH".
Enabling flash write... OK.
Found Winbond flash chip "W25Q64.V" (8192 kB, SPI) mapped at physical address 0x00000000ff800000.
This coreboot image (PC Engines:apu3) does not appear to
be correct for the detected mainboard (PC Engines:PCEngines apu3).
Proceeding anyway because user forced us to.
Reading old flash chip contents... done.
Erasing and writing flash chip... Erase/write done.
Verifying flash... VERIFIED.
```
