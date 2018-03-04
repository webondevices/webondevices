---
title: "JavaScript Barcode Scanner"
cover: "http://localhost:8000/posts/barcode.jpg"
category: "moar"
date: "02/12/2015"
slug: "javascript-barcode-scanner"
tags:
    - javascript
---

**This JavaScript barcode scanner application is not something closely related to electronics and hardware, the kind of stuff we normally do here on Web on Devices, but I felt I needed to publish a little bit of help on this as I receive a lot of emails asking for the source code through the youtube video I uploaded last year:**

<a class="youtube-video" href="https://www.youtube.com/embed/uA4JJCqSdZ0" target="_blank">Click to see Youtube video</a>

The code works surprisingly well and it scans pretty quickly but it doesn’t work with all types of barcodes. It has been tested with **EAN-13** type barcodes. These can be generated at [www.barcode-generator.org/](http://www.barcode-generator.org/).

Here’s a little info from WikiPedia: *An EAN-13 barcode (originally European Article Number, but now renamed International Article Number even though the abbreviation EAN has been retained) is a 13 digit (12 data and 1 check) barcoding standard. The EAN-13 barcodes are used worldwide for marking products often sold at retail point of sale*.

### Download the source code
[www.webondevices.com/download/barcode.zip](http://www.webondevices.com/download/barcode.zip)

### Settings
The script can be initialised with the following code:

``` javascript
barcode.config.start = 0.1;
barcode.config.end = 0.9;
barcode.config.video = '#barcodevideo';
barcode.config.canvas = '#barcodecanvas';
barcode.config.canvasg = '#barcodecanvasg';
barcode.setHandler(function(barcode) {
    console.log(barcode);
});

barcode.init();
```

The threshold and quality acceptance settings can be changed with these properties:

``` javascript
barcode.config.threshold: 160;
barcode.config.quality: 0.45;
```

Please note that the demo won’t run on a local environment. Upload to a web server or try MAMP/WAMP.

### Browser Support

Another thing to keep in mind is that this example relies on the Stream API and the getUserMedia method. This native JavaScript feature allows the browser to access and stream video and sound from the camera and microphone of the device to an HTML Audio or Video element and modify process the data.

This is currently not supported in Internet Explorer, Safari, iOS and Opera. Have look at the [support matrix](http://caniuse.com/#feat=stream) on caniuse.com.

I hope this little guide helps!