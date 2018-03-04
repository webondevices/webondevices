---
title: "Predict hand distance with the device light JavaScript API"
cover: "http://localhost:8000/posts/javascript-light.jpg"
category: "moar"
date: "04/08/2015"
slug: "the-arduino-plant-with-javascript-voice-recognition"
tags:
    - javascript
---

**I got excited about the device light event while I was exploring [JavaScript hardware and sensor accessing APIs](http://www.webondevices.com/9-javascript-apis-accessing-device-sensors/). I thought I could try using it to approximate object distance from the phone display. Before writing this article I asked the community to try and guess the JavaScript technology used in the demo by publishing the example video with no further explanation. I had great feedback and got the right answer from Ian Brennan after two days.**

### devicelight

The device light event is a native JavaScript API accessing the light sensor built into mobile phones and a few laptops. There are two events to use and ‘lightlevel’ only returns three states: dim, normal and bright. This is great but we are interested in raw values. The other event called ‘devicelight’ gives us exactly that. Here are the examples outputting the returned values of both events:

``` javascript
// Trying out the difference device light events

if('ondevicelight' in window){
    window.addEventListener('devicelight', function(event) {
        // light level is returned in lux units
        console.log(event.value);
    });
}

if('onlightlevel' in window){
    window.addEventListener('lightlevel', function(event) {
        // light value can be dim, normal or bright
    console.log(event.value);
    });
}
```

I was happy with the data and I thought I could use it to build a simple [theremin](https://www.youtube.com/watch?v=w5qf9O6c20o). To generate the tone and change the frequency I used the [WebAudio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/). First I started playing a constant tone:

``` javascript
var audioCtx = new (AudioContext || webkitAudioContext)(),
    osc = audioCtx.createOscillator();

osc.type = 'triangle';
osc.connect(audioCtx.destination);
osc.start(0);
```

Then I changed the frequency with the .frequency method:

``` javascript
osc.frequency.value = numberFromLightSensor;
```

Here’s how the demo looked after:

<a class="youtube-video" href="https://www.youtube.com/embed/feI18bxVtjY" target="_blank">Click to see Youtube video</a>

You might ask why we didn’t use the Proximity API for this task. Firstly, the proximity sensor this API accesses only detects up to around 10 centimetres. Also, it only returns near or far and not the actual distance in centimeters.

Please note that both the devicelight and the proximity APIs are currently only supported on Firefox.