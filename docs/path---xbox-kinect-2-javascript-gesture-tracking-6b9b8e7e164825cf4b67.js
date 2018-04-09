webpackJsonp([0xe3302d7fc5be],{444:function(n,s){n.exports={data:{markdownRemark:{html:'<p><strong>In the previous Kinect post we installed all the necessary SDKs, libraries and dependences and managed to read the stream of skeleton data inside Node.js with JavaScript. We did all this on a Windows machine as this is the most reliable way to communicate with the official Kinect SDK. Check out the previous post for more details on the installation process.</strong></p>\n<p>Here’s a quick demo of the finished gesture tracking prototype:</p>\n<p><a class="youtube-video" href="https://www.youtube.com/embed/Iad5BmZYUy8" target="_blank">Click to see Youtube video</a></p>\n<p>In this post we are going to pick up where we left off and broadcast the skeleton data from Node.js through web sockets for other computers and browser to use. In this instance we will subscribe to the feed from Chrome on a Macintosh. We will also look at basic <strong>gesture interpretation</strong> from this pure data.</p>\n<h3 id="installing-dependencies"><a href="#installing-dependencies" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Installing dependencies</h3>\n<p>In order to help us start and run a Node.js server we need to install the Express library. For the real-time data streaming through web sockets we need Socket.io. If you create a new folder and a new file called package.json and fill out the library dependencies section correctly then the <code>npm install</code> terminal command will automatically install everything for you:</p>\n<div class="gatsby-highlight">\n      <pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"webclient-express-server"</span><span class="token punctuation">,</span>\n    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.20"</span><span class="token punctuation">,</span>\n    <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"show skeletons in browser"</span><span class="token punctuation">,</span>\n    <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"index.js"</span><span class="token punctuation">,</span>\n    <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">"test"</span><span class="token operator">:</span> <span class="token string">"echo \\"Error: no test specified\\" &amp;&amp; exit 1"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">"Wouter Verweirder "</span><span class="token punctuation">,</span>\n    <span class="token property">"license"</span><span class="token operator">:</span> <span class="token string">"MIT"</span><span class="token punctuation">,</span>\n    <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">"express"</span><span class="token operator">:</span> <span class="token string">"~4.9.5"</span><span class="token punctuation">,</span>\n        <span class="token property">"socket.io"</span><span class="token operator">:</span> "~<span class="token number">1.1</span>.<span class="token number">0</span>”\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>After entering <code>npm install</code> into the command line tool inside the project folder all the necessary libraries should be installed.</p>\n<h3 id="broadcasting-skeleton-data"><a href="#broadcasting-skeleton-data" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Broadcasting skeleton data</h3>\n<p>Let’s start building our skeleton data broadcasting Node.js application. First we load all the necessary library:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> Kinect2 <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../lib/kinect2\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'express\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    server <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">createServer</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    io <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'socket.io\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>server<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>We also need an instance of the Kinect 2 library:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> kinect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Kinect2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Next, we call kinect.open() and in the same line we are also waiting for the response to be true in case powering up and accessing the Kinect sensor was successful:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">if</span><span class="token punctuation">(</span>kinect<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Kinect is ready!</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Inside this condition we start our server:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Server listening on port 8000\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Point your browser to http://www.webondevices.com\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The following expression will serve the index.html file inside the public folder. This step isn’t necessary as you can subscribe to the web socket data from html files that are not hosted on this server. Can be just a simple local page.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    res<span class="token punctuation">.</span><span class="token function">sendFile</span><span class="token punctuation">(</span>__dirname <span class="token operator">+</span> <span class="token string">\'/public/index.html\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p><img src="http://www.webondevices.com/posts/kinect1.png" alt="Kinect v2 point cloud"></p>\n<p>The final chunk of code is responsible for actually listening for received bodyFrames from the Kinect sensor which is <strong>one frame worth of skeleton data formatted into JSON</strong>. Inside the anonymous callback function we have the bodyFrame variable exposed which has the object. This is what we start sending through the web socket with the <code>io.sockets.emit()</code> command:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>kinect<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'bodyFrame\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>bodyFrame<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    io<span class="token punctuation">.</span>sockets<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">\'bodyFrame\'</span><span class="token punctuation">,</span> bodyFrame<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Finally, to kick off the whole process, we call the openBodyReader() function:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>kinect<span class="token punctuation">.</span><span class="token function">openBodyReader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Here’s how the final version looks like, all in one:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// The complete broadcast code</span>\n\n<span class="token keyword">var</span> Kinect2 <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../lib/kinect2\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'express\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    server <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">createServer</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    io <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'socket.io\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>server<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> kinect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Kinect2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span>kinect<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Server listening on port 8000\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Point your browser to http://www.webondevices.com\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        res<span class="token punctuation">.</span><span class="token function">sendFile</span><span class="token punctuation">(</span>__dirname <span class="token operator">+</span> <span class="token string">\'/public/index.html\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    kinect<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'bodyFrame\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>bodyFrame<span class="token punctuation">)</span><span class="token punctuation">{</span>\n        io<span class="token punctuation">.</span>sockets<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">\'bodyFrame\'</span><span class="token punctuation">,</span> bodyFrame<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    kinect<span class="token punctuation">.</span><span class="token function">openBodyReader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>If you save this document as broadcast.js, connect and power up the Kinect then enter node broadcast.js data broadcasting should start within a few seconds. Next task is to look at the front-end code that subscribes to this data.</p>\n<p><img src="http://www.webondevices.com/posts/kinect_v2.jpg" alt="Kinect v2"></p>\n<h3 id="subscribing-to-the-data"><a href="#subscribing-to-the-data" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Subscribing to the data</h3>\n<p>To interface with the web socket server we just created from the front-end we will use the socket.io javascript library:</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>https://cdn.socket.io/socket.io-1.3.5.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script language-javascript"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n      </div>\n<p>Once this is loaded, inside our front-end javascript file we initialise the socket by specifying the url and the port number:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> socket <span class="token operator">=</span> io<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span><span class="token string">\'http://www.webondevices.com/\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>After this step we attach an event listener onto the socket instance which in our case listens for incoming messages named “bodyFrame”. This is the name we specified in the Node.js application when we sent the data. The second argument is the handler function to call when a message was received:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>socket<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'bodyFrame\'</span><span class="token punctuation">,</span> interpretData<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Inside the <code>interpretData</code> function we can pass in the a variable which will contain the received message, which is the JSON formatted skeleton data in our case:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">interpretData</span><span class="token punctuation">(</span>bodyFrame<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Web Socket message:</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>bodyFrame<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3 id="interpreting-gestures"><a href="#interpreting-gestures" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Interpreting gestures</h3>\n<p>Let’s try investigating what the structure is inside this bodyFrame JSON object. At the first level we will find a property called bodies which contains an array of skeleton data for each skeleton tracked within the frame. This means that we can interpret gestures from <strong>multiple people</strong> standing in front of the Kinect camera the same time.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Select the first body appearing in the data</span>\n<span class="token keyword">var</span> user <span class="token operator">=</span> bodyFrame<span class="token punctuation">.</span>bodies<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The selected user skeleton has a joints property which, again, contains an array with all the boy joints tracked:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Left wrist</span>\nuser<span class="token punctuation">.</span>joints<span class="token punctuation">[</span><span class="token number">6</span><span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p>Here’s a list of all the joints:</p>\n<ul>\n<li>Spine base: 0</li>\n<li>Spine mid point: 1</li>\n<li>Neck: 2</li>\n<li>Head: 3</li>\n<li>Left shoulder: 4</li>\n<li>Left elbow: 5</li>\n<li>Left wrist: 6</li>\n<li>Left hand: 7</li>\n<li>Right shoulder: 8</li>\n<li>Right elbow: 9</li>\n<li>Right wrist: 10</li>\n<li>Right hand: 11</li>\n<li>Left hip: 12</li>\n<li>Left knee: 13</li>\n<li>Left ankle: 14</li>\n<li>Left foot: 15</li>\n<li>Right hip: 16</li>\n<li>Right knee: 17</li>\n<li>Right ankle: 18</li>\n<li>Right foot: 19</li>\n<li>Shoulder spine center: 20</li>\n<li>Left hand tip: 21</li>\n<li>Left thumb: 22</li>\n<li>Right hand tip: 23</li>\n<li>Right thumb: 24</li>\n</ul>\n<p>Each of these joints have other properties too, like depthX, and depthY which will give you the 2D positional coordinates of each of the joints. You also have other properties like cameraZ to get distance from the camera too. With this we have 3D positional information from 24 joints of the body.</p>\n<p><strong>How can we use this to do basic gesture tracking?</strong></p>\n<p>One of the simplest gestures I can think if is a swipe in the air. Something you would do to swipe through an image gallery or carousel. Let’s analyse this movement in detail. We can say that the horizontal movement of your right hand becomes a “swipe left” gesture when <strong>the speed of the hand reaches a certain threshold</strong> into the left direction. The first first problem with this is that if your whole body moves from right to the left then it will still count as an increasing speed in your hand joint but your hand actually stands still relative to your body.</p>\n<p>One solution to this is to rather than simply checking X coordinate and speed of the hand we <strong>calculate everything relative to the centre of the body</strong> which is your spine. For this, let’s first get the absolute position of the hand:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> rightHandPositon <span class="token operator">=</span> user<span class="token punctuation">.</span>joints<span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">]</span><span class="token punctuation">.</span>depthX<span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Then we get the absolute position of the spine:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> torsoPositon <span class="token operator">=</span> user<span class="token punctuation">.</span>joints<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>depthX<span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Then from this we get the relative position of the hand:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> rightHandRelativePosition <span class="token operator">=</span> rightHandPositon <span class="token operator">-</span> torsoPositon<span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Then we calculate the relative speed by checking how much the position has changed between each frames:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">var</span> oldspeed <span class="token operator">=</span> rightHandRelativePosition<span class="token punctuation">;</span>\n<span class="token keyword">var</span> rightHandRelativeSpeed <span class="token operator">=</span> rightHandRelativePosition <span class="token operator">-</span> oldspeed<span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Once we have this calculated you can simply add this value into an if condition and trigger the animation:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">if</span><span class="token punctuation">(</span>rightHandRelativeSpeed <span class="token operator">&lt;</span> <span class="token operator">-</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Swipe left</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">if</span><span class="token punctuation">(</span>rightHandRelativeSpeed <span class="token operator">></span> <span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Swipe right</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>If you would like to make your code more reliable you can add a second condition to test whether the hand is above the waist line to consider it for gestures.</p>',timeToRead:7,excerpt:"In the previous Kinect post we installed all the necessary SDKs, libraries and dependences and managed to read the stream of skeleton data…",frontmatter:{title:"XBOX Kinect 2 JavaScript gesture tracking",cover:"http://www.webondevices.com/posts/kinect-2-skeleton.jpg",date:"12/10/2015",category:"moar",tags:["javascript"]},fields:{slug:"/xbox-kinect-2-java-script-gesture-tracking"}}},pathContext:{slug:"/xbox-kinect-2-java-script-gesture-tracking"}}}});
//# sourceMappingURL=path---xbox-kinect-2-javascript-gesture-tracking-6b9b8e7e164825cf4b67.js.map