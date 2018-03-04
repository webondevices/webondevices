---
title: "Arduino Tone & MP3 Sound with No Shield"
cover: "http://www.webondevices.com/posts/arduino-audio-hero.jpg"
category: "moar"
date: "03/02/2016"
slug: "arduino-tone-mp3-sound-with-no-shield"
tags:
    - arduino
---

**Arduinos are not designed to play sound on their own as it’s quite a difficult task for that 16mhz microcontroller chip you have on an UNO to process and play sound at 64 – 128kbit per second rate which is the bit rate of a regular MP3 file.**

However if you decrease the bit rate to only 8k and down sample the file then it is possible with the help of only two digital output pins and a few resistors. As you will see the sound volume will be quite low so we will build a simple amplifier with an NPN transistor.

### Play sound

The first thing we do is build the circuit that will be connected to your mini speaker. For that you will need 6 resistors with the same amount of resistance and a few jumper wires.

![Play sound with Arduino](http://www.webondevices.com/posts/arduino-audio.jpg)

Next thing to do is download and install the library called [avr-sound](https://github.com/muayyad-alsadi/avr_sound) created by Muayyad Alsadi. Download the files from the repository and install it or manually place it into your libraries folder.

### Custom audio files

Adding your own audio files is not as simple as uploading an MP3 file. You will need to down sample the file first. [Audacity](http://audacityteam.org/) is a free application that let’s you do that. After recording and opening your audo file in Audacity first click **Track / Stereo Track to Mono**. Next change the **Project Rate to 8000hz** at the bottom of the project window. Finally go to **File / Export Audio** and select **Other uncompressed files** under file format the hit the **Options...** button. In here change the settings to **RAW (header-less) and Unsigned 8-bit PCM** then export. This has created a .raw file for you.

When you downloaded the avr-sound library it came with a python application called snd2h.py. Copy your raw audio file into the same folder you have this python application then go to your command line tool and run the following command to convert your raw audio file into a .h file that you will then be able to use straight away in the Arduino IDE:

`python snd2.py myaudiofile.raw`

This has created a .h file for you which will need to be included in your new sketch just like it is for the 3 examples that came with the library. Once you have done that add this piece of code to your main sketch:

``` c
#include 
#include “myaudiofile.h"

void setup() {
  avr_sound_init();
}

// the loop routine runs over and over again forever:
void loop() {
 play_myaudiofile();
 delay(500);
}
```

Final task left is to create the circuit.

### Amplifying the sounds

Unfortunately the sounds wouldn’t be loud enough from the output pins without an external power source so we need to build a simple amplifier to make it louder. Here’s the final circuit including a R-2R resistor ladder to generate the sound and an NPN resistor that switches power from an external battery:

![Play sound with Arduino Fritzing circuit](http://www.webondevices.com/posts/arduino-play-sound-amplified.jpg)

I tried this with an external 3.7V lipo battery which worked perfectly.

### Further improvements

Audio quality is obviously not amazing so I wouldn’t use this for human voice or music but might be perfect for simple sound effects, buzzes or tunes.

I unfortunately wanted this for human voice so I will have to keep looking. I previously tried the WTV020SD-16P module which is really cheap on ebay but it was an absolute pain to work with. It only accepted a specific SD card and by that I mean a specific brand at a specific size and it was also quite picky about file compressions. Even when it worked it randomly stopped and wouldn’t play at all.

I’m now looking at the new [DF Player Mini](http://www.dfrobot.com/index.php?route=product/product&product_id=1121). It’s quite promising and still cheap so I will order a few and test them out.