---
published: true
description: Refresh GPG key
categories: [blog]
tags: [Linux, Fedora, GPG, pass, OpenPGP, AEAD]
layout: post
---

No worries my complaining about NixOS isn't done :).
But for this blog post we take a break and ~~talk~~ complain about GPG.
I use and love [`pass`](https://www.passwordstore.org/) as my primary password manager.
Which uses gpg to encrypt and decrypt files which are tracked via git.
(I even have a small [rofi script](https://github.com/fliiiix/dotfiles/blob/main/config/scripts/rofi_pass.tpl) to access passwords quickly)

At some point my previous gpg key expired and since it was 10 years old it was time to update.
A task that sounds easy enough:

```
gpg --full-generate-key
pass init $keyid
```

and that should be it. And it might be good enough depending on your gpg version and settings.
Now the only step is to export this key and put it on my phone to unlock my password manager there.
I use a combination of [OpenKeychain: Easy PGP](https://play.google.com/store/apps/details?id=org.sufficientlysecure.keychain) and [Password Store](https://play.google.com/store/apps/details?id=dev.msfjarvis.aps).

Exporting and importing that via a USB stick on the phone was so easy.
```
gpg --export-secret-key $keyid > gpgprivate.key
```

Only to be then greeted with:

> Encountered OpenPGP Exception during operation!

### The new OpenPGP AEAD Mode

AEAD is Authenticated Encryption with Associated Data which is as far as i understand it
a way to have unencrypted data (for example router header) as a part of your authenticated
message. Meaning the receiver of the message can check if the header was modified.


And there are a bunch of incompatible modes / implementations for this.
(See: <https://articles.59.ca/doku.php?id=pgpfan:schism> for way more details)
In summary OpenGPG defaults to a mode called OCB which is not standard and
implementations like the Android App do not support.


The arch wiki contains a good description on how to disable AEAD on an existing key.
```
$ gpg --expert --edit-key <FINGERPRINT>
gpg> showpref
[ultimate] (1). Foobar McFooface (test) <foobar@mcfooface.com>
    Cipher: AES256, AES192, AES, 3DES
    AEAD: OCB
    Digest: SHA512, SHA384, SHA256, SHA224, SHA1
    Compression: ZLIB, BZIP2, ZIP, Uncompressed
    Features: MDC, AEAD, Keyserver no-modify

gpg> setpref AES256 AES192 AES SHA512 SHA384 SHA256 SHA224 ZLIB BZIP2 ZIP
Set preference list to:
    Cipher: AES256, AES192, AES, 3DES
    AEAD:
    Digest: SHA512, SHA384, SHA256, SHA224, SHA1
    Compression: ZLIB, BZIP2, ZIP, Uncompressed
    Features: MDC, Keyserver no-modify
Really update the preferences? (y/N) y
```

(source: <https://wiki.archlinux.org/title/GnuPG#Disable_unsupported_AEAD_mechanism>)

Now if we already updated the key in `pass` we unfortunately need to re-encrypt all files again.

```
for filename in ./*/*.gpg; do gpg -d -r $USER ./${filename} > ./${filename}.decrypt ; done
for filename in ./*/*.decrypt; do gpg -e -r $USER ./${filename} ; done
for filename in ./*/*.decrypt.gpg; do mv "${filename}" "${filename/.decrypt.gpg/}" ; done

git commit -am "re-encrypt passwords without AEAD mode"
git clean -dfx
```

(source: <https://github.com/open-keychain/open-keychain/issues/2096>)

And tada 🎉 our key works now on Android as well.
