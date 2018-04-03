---
title: "Fly an AR Drone with an Xbox controller and JavaScript"
cover: "http://www.webondevices.com/posts/drone2.jpg"
category: "moar"
date: "14/07/2015"
slug: "fly-an-ar-drone-with-an-xbox-controller-and-javascript"
tags:
    - javascript
---

**I always found the controls on the AR Drone mobile application not accurate enough for easy manoeuvring. I wanted something a bit more precise so I thought my USB Xbox controller would be perfect for the job. I used JavaScript to both read the gamepad data and to send control messages to the drone.**

### The Xbox controller in Node.js

There are ways to read the Xbox controller (and all other USB game controllers) straight in the browser using the JavaScript Gamepad API. I used this method in my [Arduino RC Car project](/arduino-nodejs-rc-car-driven-with-html5-gamepad-api/). But it’s much easier to use a Node.js library and do everything on the local server. We will have to run the server anyway for connecting to the drone.

<a class="youtube-video" href="https://www.youtube.com/embed/JXVaFTHzxlM" target="_blank">Click to see Youtube video</a>

The [Node Xbox Controller library](https://github.com/andrew/node-xbox-controller) let’s you do just that and it’s really easy to setup. Install the library then run this example app to see if everything is working fine. You might have to install the gamepad drivers first: [Lion/Snow Leopard](http://tattiebogle.net/index.php/ProjectRoot/Xbox360Controller/OsxDriver), [Yosemite](https://github.com/d235j/360Controller/releases)

``` javascript
var XboxController = require('xbox-controller');
var xbox = new XboxController;

xbox.on('a:press', function (key) {
    console.log(key + ' press');
});

xbox.on('b:release', function (key) {
    console.log(key+' release');
});

xbox.on('lefttrigger', function(position){
    console.log('lefttrigger', position);
});

xbox.on('righttrigger', function(position){
    console.log('righttrigger', position);
});

xbox.on('left:move', function(position){
    console.log('left:move', position);
});

xbox.on('right:move', function(position){
    console.log('right:move', position);
});

xbox.on('connected', function(){
    console.log('Xbox controller connected');
});

xbox.on('not-found', function(){
    console.log('Xbox controller could not be found');
});
```

### Driving the Drone

Luckily for this project we don’t have to use two separate libraries for reading the gamepad and driving the drone because the [Xbox-Parrot](https://github.com/glasseyes42/xbox-parrot) library does everything for us.

![AR Drone with Xbox controller and Javascript](http://www.webondevices.com/posts/george.jpg)

The AR Drone connected to Node.js and the Xbox controller
Once the default app is running in your terminal the drone is ready to take off. Here’s the basic controller layout:

Left joystick:
Front/Back => Forward / Backward
Left/Right => Strafe Left / Strafe Right

Right joystick:
Front/Back => Up / Down
Left/Right => Rotate Counter Clockwise / Rotate Clockwise

Buttons:
A => Takeoff
B => Land
X => Reset Emergency
Y => Stop

I also got the camera image streaming through to the browser for flying the drone in first person view, like if it was a simulator game. For this I used the [AR Drone webflight](https://github.com/eschnou/ardrone-webflight) library.

### Future plans

This project is just the beginning. As we can now control the Drone from Node.js with JavaScript you can use it in conjunction with other tools like the WebSpeech API. It would be fun to give voice commands to the drone. Or control it by sending Tweets?
