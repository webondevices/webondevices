---
title: "Arduino Solar Panel and Battery Power Shield by Web on Devices"
cover: "http://www.webondevices.com/posts/2018/wod-energy-shield-10.jpg"
category: "moar"
date: "27/03/2018"
slug: "arduino-solar-panel-and-battery-power-shield"
tags:
    - arduino
---

**Have you ever worked on an Arduino project you wanted to run outside your house where there are no USB ports and wall sockets available to get power from?**

<a class="youtube-video" href="https://www.youtube.com/embed/AdnmRWEK6d8" target="_blank">Click to see Youtube video</a>

The Web on Devices Arduino Energy Shield really is a great solution for these situations. It can help you power UNO projects from a battery and recharge the battery with solar energy.

![Energy Shield](http://www.webondevices.com/posts/2018/wod-energy-shield-10.jpg)

### A universal solution for powering your Arduino projects

This Arduino UNO shield has a 3.6 V lithium battery on board that can power Arduino projects for many days, weeks or months (or even forever if deep sleep is used efficiently).

The shield can also be used to power external devices (or charge your phone) from the larger, Type-A battery connector on the left side. This is possible because the internal circuit boosts the 3.6 V battery power to a regulated 5 V level that the Arduino or other USB powered devices usually require.

**Charging the on-board battery can be done in two ways:**
 - Charge through the micro **USB port** on the right side of the board (regular phone charger port)
 - Or connect a **solar panel** to the dedicated ports on the shield (panel comes with the board)

![Solar Panel](http://www.webondevices.com/posts/2018/solar-panel.jpg)

The solar panel is a very exciting feature! With the help of the panel, and a carefully planned project, you can essentially run your Arduino UNO project forever. Or as long as the sun shines :)

I tested the Energy Shield with my brand new talking plant project (post coming soon) and it was working perfectly:

![Lili](http://www.webondevices.com/posts/2018/solar-panel-lili.jpg)

### Design and production

Building this custom power shield was a lot of work. First, the board and circuit was carfully designed in EAGLE. The board has a charge and a boost circuit all working simultaneously responsible for managing the power inputs and outputs:

![eagle](http://www.webondevices.com/posts/2018/prototyping.jpg)

Next step is to find a company that can manufacture custom PCB boards with the designs you exported from EAGLE. You will also need to purchase individual components in bulk from Ebay, Aliexpress or Alibaba:

![components](http://www.webondevices.com/posts/2018/prototype-pcb.jpg)

Then depending on your budget, you get the PCB manufacturing company to assemble your prototype, or you do it yourself by hand:

![prototype](http://www.webondevices.com/posts/2018/energy-shield-prototype.jpg)

At this stage, if you are as unlucky as we were, you discover a few issues and mistakes and amend your designs in EAGLE and order a new batch of PCBs.

Once the PCBs are working perfectly you can start assemblying the boards and put them through a lot of testing.

![finishedboard](http://www.webondevices.com/posts/2018/wod-energy-shield.jpg)


### Availability

The Energy Shield is ready for mass production but it’s currently in the testing phase. If you are interested in testing our product, email us on [hello@webondevices.com](hello@webondevices.com).
