---
title: "Scanning Nespresso Capsules with JavaScript"
cover: "http://www.webondevices.com/posts/nespresso-capsules.jpg"
category: "moar"
date: "24/07/2015"
slug: "scanning-nespresso-capsules-with-javascript"
tags:
    - javascript
    - project
---

**We’ve been drinking Nespresso Capsule coffees for a while and it’s an absolute pain choosing from all the variations available. Yes, the names are written on the capsules but not everyone knows what “fortissio lungo” tastes like.**

Being a creative technologist in the office, I was instantly looking for ways to automatically identify the capsules with a clever Arduino or JavaScript hack. The unique colour of the capsules gave me the idea to scan theme somehow. First, I bought an [Arduino colour scanner](http://image4.buyincoins.com/bicv2/product/s0/1401270782_8105.jpg) module which worked well but later I decided to create something people can carry around and use on their phones.

Here’s how the finished demo looked like:

<a class="youtube-video" href="https://www.youtube.com/embed/b1e7GIfczwo" target="_blank">Click to see Youtube video</a>

For this solution I used [Tracking.js](http://trackingjs.com/). Tracking.js can track images, camera streams and videos and can recognise colours and faces in them.

### Scanning Colours
I started the project off by creating a capsule colour and tasting note definition object. This is what I use to lookup the flavours from.

``` javascript
// Flavour and colour definition object

app.flavours = [
    {
        colourName: 'Vanilio',
        red: 245,
        green: 235,
        blue: 175,
        treshold: 30,
        notes: "Full flavoured rich blend, with velvety vanilla aroma."
    },{...}];
```

When the application is opened the camera image of the Android phone or laptop appears in an HTML video element through the [MediaStream API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream). Tracking.js then starts watching the image and looking for large areas appearing filled with colours that match our definition. The simplest form of this would be something along these lines:

``` javascript
// Detecting colours from a video

var colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
    
colors.on('track', function(event) {
    if (event.data.length === 0) {
        // No colours were detected in this frame.
    } else {
        event.data.forEach(function(rect) {
            console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
        });
    }
});

// pick the video element to watch
tracking.track('#myVideo', colors);
```

Registering new colours into Tracking.js wasn’t straight forward. Here’s the piece of code from the documentation which unfortunately didn’t work with thresholds:

``` javascript
// Defining new colours to track

tracking.ColorTracker.registerColor('green', function(r, g, b) {
    if (r < 50 && g > 200 && b < 50) {
    return true;
    }
    return false;
});
```

Here's what I had to do to extend it with threshold functionality:

``` javascript
// Defining new colours to track with threshold

tracking.ColorTracker.registerColor(settings.colourName, function(r, g, b){
    if( ( r >= settings.red   - settings.treshold )
     && ( r <= settings.red   + settings.treshold )
     && ( g >= settings.green - settings.treshold )
     && ( g <= settings.green + settings.treshold )
     && ( b >= settings.blue  - settings.treshold )
     && ( b <= settings.blue  + settings.treshold ) ) {
        return true;
    }
    return false;
});
```

After this Tracking.js fires an event and calls a function each time a colour from that camera image is matched with a colour from the capsule definition. When this happens a panel slides in with the image of the capsule and reads the tasting notes using the [WebSpeech API](http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API).

I know the WebSpeech API might be a little bit too much but it ALWAYS gives that wow factor to my projects. People love talking apps and robots. Take [Geroge, the talking plant](/the-arduino-plant-with-javascript-voice-recognition) for instance who was an instant hit in the office.

Here’s how the Nespresso Scanner speaks:

``` javascript
// Reading the tasting notes up

// Speech synthesizer init
app.speech = new SpeechSynthesisUtterance();

// Select british voice
var voices = window.speechSynthesis.getVoices();
app.speech.lang = 'en-GB';
app.speech.voice = voices.filter(function(voice) { return voice.name == 'English United Kingdom'; })[0];
app.speech.rate = 1;

// Read the definition from the tasting notes object
app.speech.text = "This is a " + app.flavours[selected].cName;
speechSynthesis.speak(app.speech);
```

### Future plans
The main problem with the current implementation is that colours appearing in the camera stream are different when light conditions change. They might look brighter or darker but the biggest problem is white balance. You know when you take a photo and everything looks slightly blue or slightly red. This obviously all affect Trakcing.js.

![Nespresso capsules](http://www.webondevices.com/posts/nespresso-capsules.jpg)

The current implementation could be improved by adding a 'global white balance reference colour' that would be used to calibrate the app. In perfect light conditions the grey colour has equal amounts of red, green and blue in it, for example: 150, 150, 150. If the grey colour is 180, 130, 150 under another light condition then each colour has to be adjusted by the same amount: red + 30, green - 20, blue + 0. With this solution you would still need to re-calibrate the app each time but instead of re-calibrating all the colours you only do one.

At one point I might also build the Arduino powered scanner with my colour recognition module. The good thing about that are the 4 bright LEDs which cancels out the tinted environmental light so colours always look the same.