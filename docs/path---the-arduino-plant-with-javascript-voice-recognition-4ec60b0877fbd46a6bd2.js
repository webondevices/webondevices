webpackJsonp([62852609535123],{442:function(n,s){n.exports={data:{markdownRemark:{html:'<p><strong>George has got light, temperature, soil moisture and two motion sensors for watching the world. He complains if any of the values from the sensors are excessive and is able interact with people by answering simple questions with the help of JavaScript voice recognition. George has got a simple face in the form of an 8×8, red LED board that can display basic expressions as well as turn his eyes into the direction where people are approaching from.</strong></p>\n<p><a class="youtube-video" href="https://www.youtube.com/embed/YGVS78MR5kY" target="_blank">Click to see Youtube video</a></p>\n<h3 id="the-hardware"><a href="#the-hardware" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>The Hardware</h3>\n<p>For displaying the simple facial expressions I used an 8×8 LED board with a built in MAX7219 controller chip. I also added the LM35 temperature, a simple soil moisture and a light sensor and finally for motion detection I used two PIR sensors. George moves his eyes where you come from and only talks if someone is around. The sensor data is concatenated into a JSON string which is then sent to Node.js through the USB. Using web sockets the Node server publishes this data for the browser. <strong>In the browser we use the Web Speech APIs to talk to and listen to people.</strong></p>\n<p><img src="http://www.webondevices.com/posts/george.jpg" alt="Talking arduino plant with sensors"></p>\n<p>Please leave a comment if you would like a bit more detail on the hardware build.</p>\n<h3 id="now-were-talking"><a href="#now-were-talking" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Now we\'re talking</h3>\n<p>The plant can complain about excessive sensor readings which is done using the HTML5 Web Speech API. In its simplest form this is how you get the browser to say something:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// HTML5 SpeechSynthesis API</span>\n\n<span class="token keyword">var</span> utterance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpeechSynthesisUtterance</span><span class="token punctuation">(</span><span class="token string">\'Hello World\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nwindow<span class="token punctuation">.</span>speechSynthesis<span class="token punctuation">.</span><span class="token function">speak</span><span class="token punctuation">(</span>utterance<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Using this API and a series of if/else conditions the plant expresses its feelings. The plant has a very easily extendable vocabulary. Everything is stored in an object and for each of the events it has a list of things to say that the javascript code randomly picks from:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>plant <span class="token operator">=</span> <span class="token punctuation">{</span>\n    complain<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        hot<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n            <span class="token string">"It\'s too hot in here."</span><span class="token punctuation">,</span>\n            <span class="token string">"It\'s really warm in here"</span><span class="token punctuation">,</span>\n            <span class="token string">"I can\'t take this temperature"</span><span class="token punctuation">,</span>\n            <span class="token string">"My leaves are burning"</span><span class="token punctuation">,</span>\n            <span class="token string">"Can someone turn off the heating please?"</span>\n        <span class="token punctuation">]</span><span class="token punctuation">,</span>\n        cold<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n            <span class="token string">"It\'s too cold in here."</span><span class="token punctuation">,</span>\n            <span class="token string">"It\'s really cold in here"</span><span class="token punctuation">,</span>\n            <span class="token string">"It\'s freezing"</span><span class="token punctuation">,</span>\n            <span class="token string">"I can\'t take this temperature"</span><span class="token punctuation">,</span>\n            <span class="token string">"Can someone turn up the heating please?"</span>\n        <span class="token punctuation">]</span>\n \n    <span class="token comment">// continued...</span>\n</code></pre>\n      </div>\n<p>I then used this vocabulary and the sensor data in the data object to trigger speech whenever a value is excessive:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Triggering speech</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>temperature <span class="token operator">&lt;</span> app<span class="token punctuation">.</span>temp_min<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I\'m cold</span>\n    app<span class="token punctuation">.</span><span class="token function">speak</span><span class="token punctuation">(</span>\n        plant<span class="token punctuation">.</span>complain<span class="token punctuation">.</span>cold<span class="token punctuation">[</span>app<span class="token punctuation">.</span><span class="token function">rdm</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">" It\'s "</span> <span class="token operator">+</span> data<span class="token punctuation">.</span>temperature <span class="token operator">+</span> <span class="token string">" degrees."</span><span class="token punctuation">,</span> <span class="token boolean">false</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n                 \n<span class="token keyword">if</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>temperature <span class="token operator">></span> app<span class="token punctuation">.</span>temp_max<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I\'m hot</span>\n    app<span class="token punctuation">.</span><span class="token function">speak</span><span class="token punctuation">(</span>\n        plant<span class="token punctuation">.</span>complain<span class="token punctuation">.</span>hot<span class="token punctuation">[</span>app<span class="token punctuation">.</span><span class="token function">rdm</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">" It\'s "</span> <span class="token operator">+</span> data<span class="token punctuation">.</span>temperature <span class="token operator">+</span> <span class="token string">" degrees."</span><span class="token punctuation">,</span> <span class="token boolean">false</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p><img src="http://www.webondevices.com/posts/george-hero.jpg" alt="Talking arduino plant with sensors"></p>\n<p>Here’s the piece of code that only allows the plant to talk every 3 minutes. This boolean value is then used in the speak function:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Allowing the plant to speak every 3 minutes</span>\napp<span class="token punctuation">.</span>spokenTimer <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    app<span class="token punctuation">.</span>recentlySpoken <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">3</span> <span class="token operator">*</span> minutes<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>When someone waters the plant this delay is disabled to prevent the user from waiting 3 minutes until the voice feedback. The <code>setInterval</code> is needed to have a time range within the soil moisture level has to increase by 10% to trigger the event.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Checks if George is being watered</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>moisture <span class="token operator">+</span> <span class="token number">10</span> <span class="token operator">&lt;</span> data<span class="token punctuation">.</span>moisture<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I\'m being watered</span>\n    app<span class="token punctuation">.</span>moisture <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>moisture<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    app<span class="token punctuation">.</span><span class="token function">speak</span><span class="token punctuation">(</span>\n        plant<span class="token punctuation">.</span>thank<span class="token punctuation">.</span>water<span class="token punctuation">[</span>app<span class="token punctuation">.</span><span class="token function">rdm</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">" The last time I was watered was "</span> <span class="token operator">+</span> watered<span class="token punctuation">.</span><span class="token function">returnDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">true</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    localStorage<span class="token punctuation">.</span><span class="token function">setItem</span><span class="token punctuation">(</span><span class="token string">"lastWatered"</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n \n<span class="token comment">// Sampling moisture</span>\napp<span class="token punctuation">.</span>moistureTimer <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    app<span class="token punctuation">.</span>moisture <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>plantData<span class="token punctuation">.</span>moisture<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">30</span> <span class="token operator">*</span> seconds<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3 id="answering-questions"><a href="#answering-questions" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Answering questions</h3>\n<p>George can interpret simple questions and answers them using the HTML5 Web Speech API. This is the Hello World example of voice recognition:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// HTML5 SpeechRecognition API</span>\n\n<span class="token keyword">var</span> recognition <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">webkitSpeechRecognition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nrecognition<span class="token punctuation">.</span><span class="token function-variable function">onresult</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\nrecognition<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>There are two helper functions I added to make talking a very simple process:</p>\n<p><code>app.matchWords([array], string)</code> - You need to pass in an array of words as the first attribute and a piece of string as a second. The function then returns true or false whether any of the words in the array has been found in the string.</p>\n<p><code>app.answer(string)</code> - Pass in the piece of string as an answer and the browser will read it out loud.</p>\n<p>Here\'s a simple example that would answer you if you asked: "What\'s the temperature?" or "Are you hot?":</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Understand question then answer them</span>\n\n<span class="token comment">// Temperature</span>\n<span class="token keyword">if</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span><span class="token function">matchWords</span><span class="token punctuation">(</span>\n    <span class="token punctuation">[</span><span class="token string">"temperature"</span><span class="token punctuation">,</span> <span class="token string">"hot"</span><span class="token punctuation">,</span> <span class="token string">"cold"</span><span class="token punctuation">,</span> <span class="token string">"warm"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> text\n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    app<span class="token punctuation">.</span><span class="token function">answer</span><span class="token punctuation">(</span>\n        plant<span class="token punctuation">.</span>answer<span class="token punctuation">[</span>temp<span class="token punctuation">]</span><span class="token punctuation">[</span>app<span class="token punctuation">.</span><span class="token function">rdm</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">" "</span> <span class="token operator">+</span>\n        app<span class="token punctuation">.</span>plantData<span class="token punctuation">.</span>temperature <span class="token operator">+</span>\n        <span class="token string">" degrees"</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>All these helper functions make it very easy to extend the vocabulary of the plant and build new features.</p>\n<h3 id="future-plans"><a href="#future-plans" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Future plans</h3>\n<p>It might be worth spending a little bit extra time on George. It would be great to package him up into a nicer box rather than having bare wires hanging out from his body. I was also looking at HTML5 web speech libraries to see if anything can make him more reliable as sometimes it speaks and listens the same time and picks up and reacts to his own voice.</p>\n<p>Please let me know in the comments section if you would like to see a more detailed tutorial on the entire build.</p>',timeToRead:4,excerpt:"George has got light, temperature, soil moisture and two motion sensors for watching the world. He complains if any of the values from the…",frontmatter:{title:"The Arduino Plant with JavaScript voice recognition",cover:"http://www.webondevices.com/posts/george-hero.jpg",date:"30/06/2015",category:"moar",tags:["arduino","javascript","project"]},fields:{slug:"/the-arduino-plant-with-java-script-voice-recognition"}}},pathContext:{slug:"/the-arduino-plant-with-java-script-voice-recognition"}}}});
//# sourceMappingURL=path---the-arduino-plant-with-javascript-voice-recognition-4ec60b0877fbd46a6bd2.js.map