---
published: true
description: Package Python code as Debian packages
categories: [blog]
tags: [debian, python, pip, stdeb, packaging]
layout: post
---

Let's think about a little scenario here:
You already have a infrastructure to build and deploy debian packages.
And Debian packages are your main way of distributing things.
Your internal python project obviously also packaged as a debian package.
But not all of the needed dependencies are available in the official package repositories. 


What now? we need to package some python packages ourselves! 
Which is surprisingly straight forward. 

First you need stdeb and devscripts:

```
sudo apt-get install python3-stdeb devscripts
```

Then you need to find the git repo of the missing python dependency.
Most [pip packages](https://pypi.org/) have the official repository linked somewhere.


After cloning the most of the work is done by `stdeb`.
We can run `setup.py` like this:

```
python3 setup.py --command-packages=stdeb.command debianize
```

This will create the debian folder and most of the configuration.
A few changes I usually do is chaining the format from `quilt` to `git` in `debian/source/format`.


And the second thing we need to do by hand is update the `Build-Depends:` in `debian/control`.
At least add `git-core` and all the python packages needed to build and test the package.
To get inspiration what this could be check `install_requires` and `tests_require` in `setup.py`.


Install all build dependencies by hand or use `mk-build-deps`.

```
sudo mk-build-deps -i -r
```

And test build it with:

```
debuild -us -uc
```

Last but not least I like to add some tmp files to `.gitignore`.
```
.pybuild/
debian/debhelper-build-stamp
debian/files
debian/<PKG-NAME>.debhelper.log
debian/<PKG-NAME>.postinst.debhelper
debian/<PKG-NAME>.prerm.debhelper
debian/<PKG-NAME>.substvars
debian/<PKG-NAME>/
```

Thats it, write your Jenkins/Gitlab/Whatever CI script to build and publish your newly created debian package.