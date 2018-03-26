webpackJsonp([54919133028671],{427:function(n,a){n.exports={data:{markdownRemark:{html:'<p><strong>I got excited about the device light event while I was exploring <a href="http://www.webondevices.com/9-javascript-apis-accessing-device-sensors/">JavaScript hardware and sensor accessing APIs</a>. I thought I could try using it to approximate object distance from the phone display. Before writing this article I asked the community to try and guess the JavaScript technology used in the demo by publishing the example video with no further explanation. I had great feedback and got the right answer from Ian Brennan after two days.</strong></p>\n<h3 id="devicelight"><a href="#devicelight" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>devicelight</h3>\n<p>The device light event is a native JavaScript API accessing the light sensor built into mobile phones and a few laptops. There are two events to use and ‘lightlevel’ only returns three states: dim, normal and bright. This is great but we are interested in raw values. The other event called ‘devicelight’ gives us exactly that. Here are the examples outputting the returned values of both events:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Trying out the difference device light events</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span><span class="token string">\'ondevicelight\'</span> <span class="token keyword">in</span> window<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'devicelight\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// light level is returned in lux units</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span><span class="token string">\'onlightlevel\'</span> <span class="token keyword">in</span> window<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'lightlevel\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// light value can be dim, normal or bright</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>I was happy with the data and I thought I could use it to build a simple <a href="https://www.youtube.com/watch?v=w5qf9O6c20o">theremin</a>. To generate the tone and change the frequency I used the <a href="http://www.html5rocks.com/en/tutorials/webaudio/intro/">WebAudio API</a>. First I started playing a constant tone:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> audioCtx <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token punctuation">(</span>AudioContext <span class="token operator">||</span> webkitAudioContext<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    osc <span class="token operator">=</span> audioCtx<span class="token punctuation">.</span><span class="token function">createOscillator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nosc<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token string">\'triangle\'</span><span class="token punctuation">;</span>\nosc<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span>audioCtx<span class="token punctuation">.</span>destination<span class="token punctuation">)</span><span class="token punctuation">;</span>\nosc<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Then I changed the frequency with the .frequency method:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>osc<span class="token punctuation">.</span>frequency<span class="token punctuation">.</span>value <span class="token operator">=</span> numberFromLightSensor<span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Here’s how the demo looked after:</p>\n<p><a class="youtube-video" href="https://www.youtube.com/embed/feI18bxVtjY" target="_blank">Click to see Youtube video</a></p>\n<p>You might ask why we didn’t use the Proximity API for this task. Firstly, the proximity sensor this API accesses only detects up to around 10 centimetres. Also, it only returns near or far and not the actual distance in centimeters.</p>\n<p>Please note that both the devicelight and the proximity APIs are currently only supported on Firefox.</p>',timeToRead:2,excerpt:"I got excited about the device light event while I was exploring  JavaScript hardware and sensor accessing APIs . I thought I could try…",frontmatter:{title:"Predict hand distance with the device light JavaScript API",cover:"http://www.webondevices.com/posts/javascript-demo.jpg",date:"04/08/2015",category:"moar",tags:["javascript"]},fields:{slug:"/predict-hand-distance-with-the-device-light-java-script-api"}}},pathContext:{slug:"/predict-hand-distance-with-the-device-light-java-script-api"}}}});
//# sourceMappingURL=path---predict-hand-distance-with-the-device-light-javascript-api-13adbc915b491f6d8439.js.map