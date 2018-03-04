---
title: "Rotate a CSS 3D cube with an Arduino"
cover: "http://www.webondevices.com/posts/rotate-3d-css-cube.jpg"
category: "moar"
date: "06/08/2015"
slug: "rotate-a-css-3d-cube-with-an-arduino"
tags:
    - arduino
    - javascript
---

**I had a 3 axis gyroscope laying on my prototyping bench and I thought it would be cool to use it for something. Something with HTML and CSS...**

### A CSS 3D cube

I recently spent some time playing with 3D transforms and creating 3D objects in CSS. You can construct a cube for example buy rotating and moving 6 divs in 3D, one for each side of the cube. It’s also possible to rotate the finished object by only rotating the parent DOM element.

The idea was to combine the two techniques together: read the gyroscope sensor with an Arduino UNO, stream the data to the browser through the USB port, a Node.js server and WebSockets. Once I have the gyroscope sensor values in the browser I apply that to the transform CSS property and rotate the cube.

<a class="youtube-video" href="https://www.youtube.com/embed/TL6NFyhNdyM" target="_blank">Click to see Youtube video</a>

The gyroscope I have is quite simple and it only detects the rotation of the sensor and not the acceleration. Reading the values with the Arduino was quite straight forward. I used the [examples](https://www.sparkfun.com/tutorials/240) published on Sparkfun’s website.

### Learning the basics of JavaScript electronics
Getting the sensor readings from the Arduino to the Node.js server then to the browser is a longer process. I received lot of requests for going into more detail and explaining this process further so I decided to write and publish a completely free ebook for beginners.

This book will teach you the basics to get started with JavaScript Electronics. Scroll down to the bottom of the page to download for free.

### rotateX
Once you have the sensor values in the browser from the Node.js server through the WebSocket you can construct a CSS transform property that rotates the cube for you.

``` javascript
// Rotating the cube

var socket = io();

// listen for new socket.io messages from the serialEvent socket
socket.on('serialEvent', function (rotation) {
    console.log(rotation);
    $('.cube').css(
        '-webkit-transform',
            'rotateZ(' + (rotation.x/2 + 44) + 'deg) ' +
            'rotateX(' + -rotation.y/2 + 'deg)'
    );
});
```

I had to divide the rotation values by two because the cube was rotating faster then the sensor was rotating in real life. The cube was also slightly off centre compared to the sensor so I added +44 to calibrate it.

![The gyroscope and the Arduino](http://www.webondevices.com/posts/rotate-3d-css-cube.jpg)

Sometimes the sensor goes off for a frame or two and sends a random value. To prevent the cube from jittering I applied some smoothing. I could have done this with the sensor values in JavaScript but adding CSS transition to the transform property seemed like an easier option. The smoothing setting is currently on 0.2s. Increasing this number will make the animation smoother but will also add some lag:

``` css
.cube {
    transition: transform 0.2s;
}
```