---
published: true
description: Sort by version number with xslt
categories: [blog]
tags: [nginx, autoindex, xml, xslt]
layout: post
---

There are this moments in my life where I get really excited about 
technology. The latest of these moments was when I found out that 
nginx autoindex supports xslt out of the box.


Lets go 2 steps back what does that even mean. Nginx autoindex is the feature 
which allows you to list all available files and folders in the web root of you server.
So it's just a very simple web page listing all files as link. The config for that 
looks like this:

```
location /documentation {
	autoindex on;
}
```


The problem is, this list is really basic. Maybe this list is not good enough, maybe 
you want more than files just alphabetically sorted and listed. Maybe you want to sort 
them by date, alphabetically descending or something else. Maybe you want to style this list
which some CSS. And that exactly what I want to do. I have folders with different versions 
like 2.07.03 and 3.0.0 and I want to sort them in a way that you see the latest version first.
So that you see 3.0.0 > 2.07.03.


And here comes xslt (and my excitement) in to play. Nginx autoindex does also support 
three alternative output modes to html. Thats xml, json and jsonp. And when you use 
xml you can provide your own xslt file. So that is what we do:


```
location /documentation {
	autoindex on;
	autoindex_format xml;
	xslt_stylesheet /path/to/your/transform.xslt;
}
```

You find the full documentation for the xslt module [here](https://nginx.org/en/docs/http/ngx_http_xslt_module.html). And now we can use all the amazingness of xslt.

The plain xml autoindex generates looks like this:


```
<?xml version="1.0"?>
<list>
  <directory mtime="2018-08-23T09:40:02Z">2.12.01</directory>
  <directory mtime="2018-11-19T15:04:06Z">2.12.02</directory>
  <directory mtime="2018-09-05T14:07:04Z">3.0.0</directory>
  <directory mtime="2018-10-08T07:14:02Z">3.0.1</directory>
  <directory mtime="2018-11-29T17:06:58Z">3.0.12</directory>
  <directory mtime="2018-11-13T11:34:26Z">2.99.99</directory>
  <directory mtime="2018-11-29T17:06:58Z">latest</directory>
</list>
```

And here is how you sort with xslt by version.

```
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8" indent="yes"/>

<xsl:template match="/list">
    <html>
        <body>
            <table>
                <tr>
                    <th>name</th>
                    <th>date</th>
                </tr>
                <xsl:for-each select="directory">
                    <xsl:sort select="substring-before(., '.')" data-type="number" order="descending"/>
                    <xsl:sort select="substring-before(substring-after(., '.'), '.')" data-type="number" order="descending"/>
                    <xsl:sort select="substring-after(substring-after(., '.'), '.')" data-type="number" order="descending"/>
                    <tr>
                        <td>
                            <a href=".">
                                <xsl:value-of select="."/>
                            </a>
                        </td>
                        <td>
                            <xsl:value-of select="substring(@mtime, 9, 2)"/>
                            <xsl:text>-</xsl:text>
                            <xsl:value-of select="substring(@mtime, 6, 2)"/>
                            <xsl:text>-</xsl:text>
                            <xsl:value-of select="substring(@mtime, 1, 4)"/>
                            <xsl:text> </xsl:text>
                            <xsl:value-of select="substring(@mtime, 12, 8)"/>
                        </td>
                    </tr>
                </xsl:for-each>
            </table>
        </body>
    </html> 
</xsl:template>

</xsl:stylesheet>
```

As you can see this creates just a basic html table so I leave it up to to 
you to Style it in a way you like. And a big thanks to 
[michael.hor257k](https://stackoverflow.com/a/53568517/1279355) on stackoverflow
who created this readable version of the xslt based on my horrible 
hacky xslt.


Enjoy your new fancy autoindex pages!
