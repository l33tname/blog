---
published: true
description: Why I spend my nights debugging PHP
categories: [blog]
tags: [PHP, debugging, Observium, DNS]
layout: post
---

I try to avoid PHP software when ever possible. But sometimes the best tool for the job is written in PHP. 
One of this tools is [observium]( http://www.observium.org/ ) which is a network monitoring platform. And I can 
really recommend it. But sadly it's written in PHP, because of that I accidentally start debugging at one evening. 

But first things first. I want to add my RaspberryPi which is my primary DNS server to observium. So I click on add device
fill out the snmp infos and woops "Could not resolve $host". My first thought was well I forgot something, after I double checked 
everything and it was still not working. This was the point where I was annoyed enough to debug PHP code. 

After poking a while in the source code I found this:

```
dns_get_record($host, DNS_A + DNS_AAAA)
```

This was my first WTF moment I mean seriously DNS_A + DNS_AAAA what should that do. A grep later with no result, it was clear that 
it must be a function of PHP. And look it's in the [manual]( http://php.net/manual/en/function.dns-get-record.php ). Turns out the 
way they implement it, allow to do addition and subtraction with this constants since there are internally bit masks or something. 
Which is a smart idea but of course you find this is not in the manual, it's only in a comment below.

Anyway if you now read in the manual what dns_get_record should return:

> This function returns an array of associative arrays, or FALSE on failure.

Doesn't sound entirely wrong. A empty array on a failure might come in handy, why I show you in a second. 

```
var_dump(dns_get_record($host, DNS_A));


array(1) {
  [0]=>
  array(5) {
    ["host"]=>
    string(14) "host.name.tdl"
    ["class"]=>
    string(2) "IN"
    ["ttl"]=>
    int(0)
    ["type"]=>
    string(1) "A"
    ["ip"]=>
    string(12) "192.168.17.2"
  }
}
```

Like in the manual described a array is returned.

```
var_dump(dns_get_record($host, DNS_AAAA));

PHP Warning:  dns_get_record(): DNS Query failed in file.php on line 4
bool(false)
```

Like in the manual described it returns FALSE if the is no AAAA record found. 


I guess you can assume what happens when you combine these two requests.  

```
var_dump(dns_get_record($host, DNS_A + DNS_AAAA));

PHP Warning:  dns_get_record(): DNS Query failed in file.php on line 4
bool(false)
```

Right it returns only FALSE in this case, even if there is a A record for this domain. 


##And the moral of this story

Deploy IPv6 everywhere to prevent such things. Or maybe don't build software based on PHP. 
I personally recommend both things. 

If you are a observium pro user it's fixed, according the mailing list in revision 6357 and for 
everyone else with the next half yearly release. 