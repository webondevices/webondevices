---
title: "9 JavaScript APIs accessing Device Hardware"
cover: "http://www.webondevices.com/posts/JavaScript.jpg"
category: "moar"
date: "08/07/2015"
slug: "9-javascript-apis-accessing-device-sensors"
tags:
    - javascript
---

**My [RC car](/arduino-nodejs-rc-car-driven-with-html5-gamepad-api) and my [desk plant](/the-arduino-plant-with-javascript-voice-recognition) both have an Arduino microcontroller onboard and I used a Node.js server to interface with them through the USB port. This is a great way to build prototypes and toys for yourself but sometimes you want your demos to work on regular phones or laptops in the browser without extra hardware or software. This is why it’s worth exploring all the available, native HTML5 and JavaScript APIs that allow us to access hardware components and sensors in our devices.**

![JavaScript device sensor apis](http://www.webondevices.com/posts/JavaScript.jpg)

### Phone Calls and Text Messages

The most important features of our mobile devices are obviously making phone calls and sending text messages. It is actually possible with pure HTML to start a call and compose a text message by simply adding a special href value where normally regular URLs go. Pure HTML magic!

``` html
<a href="tel:+44703567387625">
    Call number!
</a>

<a href="sms:+44703567387625?body=Hello%20there!">
    Compose SMS!
</a>
```

### Geolocation API

The geolocation API gives you information about the location of the user. There are multiple ways for the browser to get this data and some are more accurate than others (GPS vs. GSM or Wi-Fi). The `navigator.geolocation` object is what we use to retrieve the global latitude and longitude position.

Browser support of the Geolocation API is greate. Even IE9 handles it.

``` javascript
// Check support
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
}

function success(position) {
    console.log('Latitude: ' + position.coords.latitude);
    console.log('Longitude: ' + position.coords.longitude);
}
```

### Device Orientation and Device Motion API

The Device Orientation API accesses the built in gyroscope and compass of your device and can tell you the rotation angle of it in three dimension.

``` javascript
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(eventData) {
        // gamma is the left-to-right tilt in degrees
        console.log(eventData.gamma);

        // beta is the front-to-back tilt in degrees
        console.log(eventData.beta);

        // alpha is the compass direction the device is facing in degrees
        console.log(eventData.alpha);
    }, false);
}
```

Device Motion API on the other hand uses the accelerometer to tell when the device moves or rotates into any direction. Keep in mind that it only detects acceleration and not the speed.

``` javascript
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(eventData) {   
        // Acceleration
        console.log(eventData.acceleration.x);
        console.log(eventData.acceleration.y);
        console.log(eventData.acceleration.z);
    
        // Acceleration including gravity
        console.log(eventData.accelerationIncludingGravity.x);
        console.log(eventData.accelerationIncludingGravity.y);
        console.log(eventData.accelerationIncludingGravity.z);

        // Rotation rate
        console.log(eventData.rotationRate.alpha);
        console.log(eventData.rotationRate.beta);
        console.log(eventData.rotationRate.gamma);
    }, false);
}
```

Browser support on both of these APIs are very good. There are no problems in iOS and Android at all and even IE for Windows Phone started supporting it from version 11.

### Vibration API

The built in vibration motor of your device can be used to give subtle notifications to the user. It also offers a great way to give haptic feedback when a button or other element is tapped on the website. Although browser support is not as good as of the previous APIs but it can very easily be introduced as a progressive enhancement. This simply means that it will work on modern browsers but won’t break anything on the ones not supporting it. Android, Chrome, Firefox and Opera all support this.

``` javascript
var vibrate = navigator.vibrate || navigator.mozVibrate;

// vibrate for 1 second
vibrate(1000);

// vibrate for 1 second, then pause for half, then vibrate for another 1 second
vibrate([1000, 500, 2000]);
```

### Battery Manager API
There are many ways to use the battery status information on a web app. We can prevent complex, cpu heavy animations and calculations from running or large assets from downloading when the battery is low on power. This API worked both on my laptop and my Android phone in Chrome and it should also work in Firefox and Opera too.

``` javascript
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

function logBattery(battery) {
    console.log(battery.level);
    console.log(battery.charging);
    console.log(dischargingTime);

    battery.addEventListener('chargingchange', function() {
        console.log('Battery chargingchange event: ' + battery.charging);
    }, false);
}

if (navigator.getBattery) {
    navigator.getBattery().then(logBattery);
} else if (battery) {
    logBattery(battery);
}
```

### Device Light API

This API uses the built in light level sensor of your device and returns the readings in lux units. Unfortunately, accessing this sensor is only supported in Firefox but it’s worth mentioning in case you are setting up a kiosk or tech demo where browser support doesn’t matter.

In the future, when CSS4 support increases, we might also start using the [CSS4 light-level media query](http://dev.w3.org/csswg/mediaqueries4/#light-level) to change CSS styling when light conditions change. Very exciting!

In the mean time here’s a simple way to get this information with the JavaScript API:

``` javascript
if('ondevicelight' in window) {
    window.addEventListener("devicelight", function(event) {
        //light level is returned in lux units
        console.log(event.value + " lux");
    });
}

if('onlightlevel' in window){
    window.addEventListener("lightlevel", function(event) {
        //light value can be dim, normal or bright
        console.log(event.value);
    });
}
```

### Proximity Events API
The proximity sensor can usually be found on the front of your device and it uses its measurements to tell when you put your phone against your ear or when you reach towards it. It’s an accurate little sensor so it can tell the distance of any object held in front of the phone.

Similarly to the Device Light API this one is only support in Firefox.

``` javascript
if('ondeviceproximity' in window) {
    // Fired when object is in the detection zone
    window.addEventListener('deviceproximity', function(event) {
        // Object distance in centimeters 
        console.log(event.value + " centimeters");
    });
} else {
    console.log("deviceproximity not supported");
}

if('ondeviceproximity' in window){
    // Fired when object is in the detection zone
    window.addEventListener('userproximity', function(event) {
        if(event.near == true) {
            console.log("Object is near");
        } else {
            console.log("Object is far");
        }
    });
} else {
    console.log("userproximity not supported");
}
```