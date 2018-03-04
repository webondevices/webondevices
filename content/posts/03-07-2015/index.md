---
title: "Tweet and Text Message an Arduino air quality reading"
cover: "http://www.webondevices.com/posts/mq.jpg"
category: "moar"
date: "03/07/2015"
slug: "tweet-and-text-message-an-arduino-air-quality-reading"
tags:
    - arduino
    - javascript
---

**This little app tweets and texts notifications to your phone from a Node.js server when the Arduino air quality sensor detects high levels of natural gasses which we normally associate with bad smell.**

![Talking arduino plant with sensors](http://www.webondevices.com/posts/mq2.jpg)

I used the cheap MQ-2 natural gas sensor I bought from eBay. It’s sensitive to Methane, Butane, LPG, smoke and many other flammable or combustible gasses. It’s really easy to connect the sensor to the Arduino: first we need to power it up from the board so we connect it to the 5V and GND pins then its analog output pin to the analog input pin on the Arduino (A0).

The sensor reading is then sent to the serial port (USB) for the Node.js server once every second.

``` c
// Arduino code to read sensor and send through the USB

void setup(){
    Serial.begin(9600);
}

void loop(){
    Serial.println(analogRead(0));
    delay(1000);
}
```

This message coming through the USB port from the Arduino is something we wouldn’t be able to read from a regular browser. Due to security reasons this is only available for the server which is why we use Node.js along with the serial library. I did something very similar with my [Arduino RC Car](http://www.webondevices.com/arduino-rc-car-driven-with-a-usb-racing-wheel-and-javascript) so have a look for the serial communication logic there.

### Tweeting from JavaScript

First we need to load the Twitter node library in our server javascript file then initialise it with the unique keys and tokens:

``` javascript
// Initialising the Twitter API

var T = new Twit({
    consumer_key:         'xyz123'
  , consumer_secret:      'xyz123'
  , access_token:         'xyz123'
  , access_token_secret:  'xyz123'
});
```

Once it’s initialised you can tweet with the T.post() command:

``` javascript
// Tweeting from Node.js

T.post('statuses/update', { status: "The air quality in your room is" + data + "" }, function(err, data, response) {
    console.log(data);
});
```

### Texting from JavaScript

For text messages to your phone we use [Twilio](https://www.twilio.com/docs/node/install). Twilio also needs to be initialised with the tokens before using it:

``` javascript
// Initialising the Twilio API

var client = require('twilio')('xy', 'yz');
```

After this you can easily send text messages to any mobile number with the `sms.messages.post()` method:

``` javascript
// Texting from Node.js

client.sms.messages.post({
    to: '+44xxx',
    from:'+44xxx',
    body:"The air quality in the office is" + data + ""
}, function(err, text) {
    console.log('Current status of this text message is: ');
});
```

This project shows a lot of potential. You can see that as soon as the sensor reading arrives in Node.js the possibilities are infinite. You can start saving these values into a database or a google spreadsheet or simply send it to the browser through web sockets and the socketIO library. The air quality sensor could also be swapped out to any other analog sensor like temperature, light or sound without modifying the code.
