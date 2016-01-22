---
categories:
- blog
date: 2014-07-17T00:00:00Z
description: Setup ruby with rvm
published: true
tags:
- ruby
- rvm
url: /2014/07/17/Install-Ruby-with-RVM/
---

I explained today how you install ruby with rvm for a friend.

I thought it would be nice if I summarize this a bit.

First of all you want a ruby version manager there is [rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) and many [more](https://github.com/markets/awesome-ruby#environment-management). But why you want this? 
Simply because you never know if you want to test something in an older version or with jruby. I assume that you are running a Linux with bash as your shell. 

##Enough blabla
 
Install rvm

```
\curl -sSL https://get.rvm.io | bash
``` 

Load rvm

``` 
source .bash_profile
```

Enable autolib

```
rvm autolib enable
```

Install the lastest MRI Ruby

```
rvm install ruby
```

##Why

Why rvm and not rbev or X is much better than rvm, sure go ahead and use whatever you like (I don't care).
And what does autolib? [Autolib](https://rvm.io/rvm/autolibs) is a new feature of rvm which install the right 
native libraries for your system.
