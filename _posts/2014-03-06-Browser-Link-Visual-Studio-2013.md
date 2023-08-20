---
published: true
description: Browser Link in Visual Studio 2013
categories: [blog]
tags: [Visual Studio 2013, Browser Link, Windows, Micorsoft]
layout: post
---

Mit dem neuen Visual Studio 2013 gibt es etwas das sich Browser Link nennt. Eigentlich eine nette idee eine aus dem Visual Studio raus mehr als ein gerät zu refreshen.
Was es alles so kann kann man hier nachlesen [Browser Link feature in Visual Studio Preview 2013](https://devblogs.microsoft.com/dotnet/browser-link-feature-in-visual-studio-preview-2013/).

Ich find es aber scheisse sollange es mein Solution Explorer mit `poll?transport=longPolling&connectionToken=` voll rotzt.

![example](/blog-bilder/2014-03-06-Browser-Link-Visual-Studio-2013_img1.PNG)

Bitte Microsoft fix das, oder macht irgendwo eine Option das man das ausblenden kann. Solange kann man es aber auch bequem austellen, und zwar hier: ![fix](/blog-bilder/2014-03-06-Browser-Link-Visual-Studio-2013_img2.PNG)

## Update

Da es manchmal dazu tendiert Einstellungen zu ignorieren, kann man sich auch einfach ein Eintrag im web.config machen. 

```
<appSettings>
    <add key="vs:EnableBrowserLink" value="false"/>
</appSettings>
```
