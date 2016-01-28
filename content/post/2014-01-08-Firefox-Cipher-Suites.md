+++
date = "2014-01-08T00:00:00Z"
title = "Firefox Cipher Suites"
description = "Enable more security in your browser."
tags = ["Firefox", "TLS/SSL", "security"]
url = "/blog/2014/01/08/firefox-cipher-suites/"

+++

What is a cipher suite? This is a named combination of authentication, encryption, and message authentication code (MAC) algorithms 
which is used for TLS and SSL. And many of these cipher suite are by default in your Browser and known as insecure.


The nice thing about this is you can fix these really fast.


1. go to `about:config`
2. set `security.tls.version.max` to 3
3. search all `security.ssl3.` disable all exept these from the list below

```
security.ssl3.rsa_des_ede3_sha
security.ssl3.rsa_aes_256_sha
security.ssl3.rsa_aes_128_sha
security.ssl3.dhe_rsa_des_ede3_sha
security.ssl3.dhe_rsa_aes_256_sha
security.ssl3.dhe_rsa_aes_128_sha
security.ssl3.ecdhe_rsa_aes_256_sha
```

You can see on [https://www.howsmyssl.com](https://www.howsmyssl.com) if you got everything right. 


Check these in all browser and help friends and family with this!
