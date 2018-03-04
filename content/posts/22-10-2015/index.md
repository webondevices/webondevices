---
title: "Control your Mac from an Arduino with JavaScript and Node.js"
cover: "http://www.webondevices.com/posts/button.jpg"
category: "moar"
date: "22/10/2015"
slug: "control-your-mac-from-an-arduino-with-javascript-and-node-js"
tags:
    - arduino
    - javascript
---

**Today, in this quick project we will hookup a simple push button to an Arduino UNO and trigger OS X, operating system level commands from Node.js and JavaScript. In this specific example we will put the computer in sleep and mute the system sound volume when the button is pressed. We will also look at a few other commands you can try by simply changing one line of code.**

This project really is a simple one. The Arduino code will be 7 lines and the Node.js application is 14 lines so I encourage you to try it! We will first check the button state with the Arduino, then send a message through the USB port to the Node.js application where we simply run terminal commands to perform certain tasks.

![button](http://www.webondevices.com/posts/button.jpg)

If you would like to get started from the very basics of Arduino and Node.js, download my Free ebook which will teach you all the basics in a few hours.

### Arduino part

For the button I used a breakout board. This module has three pins: S, V and G. V is what you connect to the 5V pin on the Arduino and G to the GND pin. After this the button is powered up. The last step is to connect the third pin, S (Signal) to one of the input pins of the Arduino. The button connects the supplied 5V voltage from the V pin straight to the S pin but breaks the circuit when you press the button. **This voltage change is what you’re Arduino input pin will detect**. I randomly picked number 6 for this circuit.

After this I opened up the Arduino IDE and wrote the sketch that first checks whether the button is pressed then **sends a message through the USB port**. This serial message is what we will later pick up and read from Node.js using the serial port library.

``` c
void setup() {
    pinMode(6, INPUT);
    Serial.begin(9600);
}

void loop() {
    if(digitalRead(6) == LOW){
        Serial.println("Clicked");
    }
}
```

This will result in the “Clicked” serial port message sent through the USB when the button is clicked.

### Node.js server part

In our Node.js application we first include the Serialport library then save the library instance into another variable. In the third line we load the Shell JS library which will let us **run OS X Terminal commands within the Node.js application**.

``` javascript
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var shelljs = require('shelljs/global’);
```

Next, we create an instance of our USB port by passing in the name of the port, then a settings object that specifies that we will interpret a message when a new line character is received.

``` javascript
var myUSB = new SerialPort("/dev/cu.usbmodem1421", {
    parser: serialport.parsers.readline("\r\n")
});
```

The USB port instance has an on data event listener which exposes a data variable containing our message:

``` javascript
myUSB.on("data", function(data){
    console.log(data);

    if(data === "Clicked"){
        // Button was clicked
    }
});
```

The problem with this piece of code is that when we press the button the Arduino constantly keeps streaming the “Clicked” message one by one until we release the button. This means that whatever we put inside condition will be executed multiple times. To prevent this from happening we only interpret the first message as a click, then disable the functionality for the next five seconds:

``` javascript
var enabled = true;

myUSB.on("data", function(data){
    if(data === “Clicked” && enable){
        // Quickly disable the button
        enabled = false;
        // Enable after 5 seconds
        setTimeout(function(){
            enabled = true;
        }, 5000);

        // Terminal commands come here
    }
});
```

After the button logic is sorted let’s look at all the things we can do with OS X from here:

```
// Opens up a youtube video (or any other URL)
exec('open https://www.youtube.com/watch?v=El9K_EEv8cU', {silent:true}).output;

// Mutes system volume (or change it to a specific volume from 0 to 10)
exec(‘osascript -e “set Volume 0"', {silent:true}).output;

// Puts computer to sleep immediately
exec(‘pmset sleep now', {silent:true}).output;

// Mission Control
exec(‘/Application/Mission\ Control.app/Contents/MacOS/Mission\ Control', {silent:true}).output;

// Show desktop
exec(‘/Application/Mission\ Control.app/Contents/MacOS/Mission\ Control 1', {silent:true}).output;

// Exposé
exec(‘/Application/Mission\ Control.app/Contents/MacOS/Mission\ Control 2', {silent:true}).output;
```

This is just the beginning and you can obviously add most Terminal commands in here. You could automate a GIT command or a Grunt or Gulp task you often have to use.

**What would you use this script for?**