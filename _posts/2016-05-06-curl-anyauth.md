---
published: true
description: How anyauth should work
categories: [blog]
tags: [curl, php, pfSense, iwantmyname, DDNS]
layout: post
---


I use pfSense on my primary home router. And it's awesome! If you haven't tried it, you should absolutely https://www.pfsense.org/. 
It's based on FreeBSD and since the last update to 2.3.0 it even looks nice. Because my internet provider doesn't provide a static 
IP I use Dynamic DNS. Dynamic DNS is a thing which describes the process of a client with a changing IP keeping a DNS record up to date. 
This means every time the client IP changes the client triggers an update of the DNS record for it. With this in place you can access your 
home network always over something like dyndns.mydomain.tdl. 

I thought it would be easy to setting this up for my home network, well I was wrong. It should be simple pfSense suports DDNS out of the box
[Dynamic DNS]( https://www.pfsense.org/about-pfsense/features.html#dynamic-dns ). And my domain provider has a page which describes how their 
DDNS API works: [ddns dynamic dns service on your own domain](https://iwantmyname.com/blog/2012/03/ddns-dynamic-dns-service-on-your-own-domain.html). 

So I filled out the DDNS page and it just didn't work. And the advance login is not helpful at all. 

![pfSense DDNS setting](/blog-bilder/2016-05-06-pfsense-ddns.png)

That is why I added a bit logging code to `/etc/inc/dyndns.class` to see what curl does. The result was something like this:

```
*   Trying 45.55.114.21...
* Connected to iwantmyname.com (45.55.114.21) port 443 (#0)
* Initializing NSS with certpath: sql:/etc/pki/nssdb
*   CAfile: /etc/pki/tls/certs/ca-bundle.crt
  CApath: none
* SSL connection using TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
* Server certificate:
* 	subject: CN=iwantmyname.com,O=iwantmyname (ideegeo group Ltd),L=Wellington,ST=Wellington,C=NZ,postalCode=6011,STREET=167b Vivian Street,STREET=Te Aro,serialNumber=2131522,incorporationCountry=NZ,businessCategory=Private Organization
* 	start date: Apr 10 00:00:00 2015 GMT
* 	expire date: Apr 25 12:00:00 2017 GMT
* 	common name: iwantmyname.com
* 	issuer: CN=DigiCert SHA2 Extended Validation Server CA,OU=www.digicert.com,O=DigiCert Inc,C=US
> GET /basicauth/ddns?hostname=dyndns.domain.tdl&myip=151.XXX.XXX.XXX HTTP/1.1
> User-Agent: curl/7.40.0
> Host: iwantmyname.com
> Accept: */*
> 
< HTTP/1.1 403 Forbidden
< Server: nginx
< Date: Sun, 01 May 2016 09:45:59 GMT
< Content-Type: text/plain; charset=UTF-8
< Content-Length: 8
< Connection: keep-alive
< Set-Cookie: iregistrar_session=1234; path=/; expires=Sun, 01-May-2016 10:15:59 GMT; secure; HttpOnly
< Set-Cookie: csrf_session=1234; path=/; HttpOnly
< 
* Connection #0 to host iwantmyname.com left intact
```

And the response was `badauth.`, so I double checked my username and password but it still didn't work.
The next thing was to recreate this error with curl. For that I checked which arguments are used in the code.

```
case 'custom':
case 'custom-v6':
        if (strstr($this->dnsUpdateURL, "%IP%")) {$needsIP = TRUE;} else {$needsIP = FALSE;}
        if ($this->_dnsUser != '') {
                if ($this->_curlIpresolveV4) {
                        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
                }
                if ($this->_curlSslVerifypeer) {
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
                } else {
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
                }
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
                curl_setopt($ch, CURLOPT_USERPWD, "{$this->_dnsUser}:{$this->_dnsPass}");
        }
        $server = str_replace("%IP%", $this->_dnsIP, $this->_dnsUpdateURL);
        if ($this->_dnsVerboseLog) {
                log_error(sprintf(gettext("Sending request to: %s"), $server));
        }
        curl_setopt($ch, CURLOPT_URL, $server);
        break;
```

And as you can see in this snipped it's something like this:

```
$ curl -vv --anyauth "https://iwantmyname.com/basicauth/ddns?hostname=dyndns.domain.tdl&myip=151.XXX.XXX.XXX" 
```

I recreated the error, this was when I figured out that there is no Authentication header in my request. And 
now it makes totally sense that my response is badauth, because there is no authentication. The question is now 
what does --anyauth. For that I consulted the [man page](https://curl.haxx.se/docs/manpage.html) 

> Tells curl to figure out authentication method by itself, and use the most secure one the remote site claims to support. 
> This is done by first doing a request and checking the response-headers, thus possibly inducing an extra network round-trip. 

This sounds cool but as you can see in the log I don't get a response with a 401 status code and which authentication method are 
supported, I just get an 403 Forbidden. Expected would be something like this:

```
< HTTP/1.1 401 Unauthorized
< Content-Length: 757
< Vary: Accept-Encoding
< Server: nginx
< Date: Fri, 06 May 2016 11:04:43 GMT
< Content-Type: text/html;charset=utf-8
< Www-Authenticate: Basic realm="iwantmyname simple api"
```

So as a quick fix I just changed 

```
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
```

to


```
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
```

Which works fine. Since now the Basic Authentication is added to the first request. Which looks then like this:

```
* Server auth using Basic with user 'username'
> GET /basicauth/ddns?hostname=dyndns.domain.tdl&myip=151.XXX.XXX.XXX HTTP/1.1
Host: iwantmyname.com
Authorization: Basic 1234=
```

For the long term I hope [iwantmyname](https://iwantmyname.com/) will fix their API. <s>(I will probably update this blog post if that happens).</s>

### Update

They fixed it!
