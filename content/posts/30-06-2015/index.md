---
title: "The Arduino Plant with JavaScript voice recognition"
cover: "http://www.webondevices.com/posts/george-hero.jpg"
category: "moar"
date: "30/06/2015"
slug: "the-arduino-plant-with-javascript-voice-recognition"
tags:
    - arduino
    - javascript
    - project
---

**George has got light, temperature, soil moisture and two motion sensors for watching the world. He complains if any of the values from the sensors are excessive and is able interact with people by answering simple questions with the help of JavaScript voice recognition. George has got a simple face in the form of an 8×8, red LED board that can display basic expressions as well as turn his eyes into the direction where people are approaching from.**

<a class="youtube-video" href="https://www.youtube.com/embed/YGVS78MR5kY" target="_blank">Click to see Youtube video</a>

### The Hardware

For displaying the simple facial expressions I used an 8×8 LED board with a built in MAX7219 controller chip. I also added the LM35 temperature, a simple soil moisture and a light sensor and finally for motion detection I used two PIR sensors. George moves his eyes where you come from and only talks if someone is around. The sensor data is concatenated into a JSON string which is then sent to Node.js through the USB. Using web sockets the Node server publishes this data for the browser. **In the browser we use the Web Speech APIs to talk to and listen to people.**

![Talking arduino plant with sensors](http://www.webondevices.com/posts/george.jpg)

Please leave a comment if you would like a bit more detail on the hardware build.

### Now we're talking

The plant can complain about excessive sensor readings which is done using the HTML5 Web Speech API. In its simplest form this is how you get the browser to say something:

``` javascript
// HTML5 SpeechSynthesis API

var utterance = new SpeechSynthesisUtterance('Hello World');
window.speechSynthesis.speak(utterance);
```

Using this API and a series of if/else conditions the plant expresses its feelings. The plant has a very easily extendable vocabulary. Everything is stored in an object and for each of the events it has a list of things to say that the javascript code randomly picks from:

``` javascript
plant = {
    complain: {
        hot: [
            "It's too hot in here.",
            "It's really warm in here",
            "I can't take this temperature",
            "My leaves are burning",
            "Can someone turn off the heating please?"
        ],
        cold: [
            "It's too cold in here.",
            "It's really cold in here",
            "It's freezing",
            "I can't take this temperature",
            "Can someone turn up the heating please?"
        ]
 
    // continued...
```

I then used this vocabulary and the sensor data in the data object to trigger speech whenever a value is excessive:

``` javascript
// Triggering speech

if(data.temperature < app.temp_min) {
    // I'm cold
    app.speak(
        plant.complain.cold[app.rdm(5)] + " It's " + data.temperature + " degrees.", false
    );
}
                 
if(data.temperature > app.temp_max) {
    // I'm hot
    app.speak(
        plant.complain.hot[app.rdm(5)] + " It's " + data.temperature + " degrees.", false
    );
}
```

![Talking arduino plant with sensors](http://www.webondevices.com/posts/george-hero.jpg)

Here’s the piece of code that only allows the plant to talk every 3 minutes. This boolean value is then used in the speak function:

``` javascript
// Allowing the plant to speak every 3 minutes
app.spokenTimer = setInterval(function(){
    app.recentlySpoken = false;
}, 3 * minutes);
```

When someone waters the plant this delay is disabled to prevent the user from waiting 3 minutes until the voice feedback. The `setInterval` is needed to have a time range within the soil moisture level has to increase by 10% to trigger the event.

``` javascript
// Checks if George is being watered

if(app.moisture + 10 < data.moisture) {
    // I'm being watered
    app.moisture = parseInt(data.moisture);
    app.speak(
        plant.thank.water[app.rdm(5)] + " The last time I was watered was " + watered.returnDate(), true
    );
    localStorage.setItem("lastWatered", new Date());
}
 
// Sampling moisture
app.moistureTimer = setInterval(function(){
    app.moisture = parseInt(app.plantData.moisture);
}, 30 * seconds);
```

### Answering questions

George can interpret simple questions and answers them using the HTML5 Web Speech API. This is the Hello World example of voice recognition:

``` javascript
// HTML5 SpeechRecognition API

var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
    console.log(event);
}
recognition.start();
```

There are two helper functions I added to make talking a very simple process:

`app.matchWords([array], string)` - You need to pass in an array of words as the first attribute and a piece of string as a second. The function then returns true or false whether any of the words in the array has been found in the string.

`app.answer(string)` - Pass in the piece of string as an answer and the browser will read it out loud.

Here's a simple example that would answer you if you asked: "What's the temperature?" or "Are you hot?":

``` javascript
// Understand question then answer them

// Temperature
if(app.matchWords(
    ["temperature", "hot", "cold", "warm"], text
)){
    app.answer(
        plant.answer[temp][app.rdm(2)] + " " +
        app.plantData.temperature +
        " degrees"
    );
}
```

All these helper functions make it very easy to extend the vocabulary of the plant and build new features.

### Future plans

It might be worth spending a little bit extra time on George. It would be great to package him up into a nicer box rather than having bare wires hanging out from his body. I was also looking at HTML5 web speech libraries to see if anything can make him more reliable as sometimes it speaks and listens the same time and picks up and reacts to his own voice.

Please let me know in the comments section if you would like to see a more detailed tutorial on the entire build.

