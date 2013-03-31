node-YouTubeStreamer
====================

It's my little experiment of streaming YouTube's video using a proxy.

Setup
====================

Just execute this on your console:

	$ cd ./node-YouTubeStreamer
	$ node server.js

_(Remember you'll need to have node.js installed to use this!)_

How to use
====================

Easy! Just open your media player / browser and load this URL:

	http://localhost:8000/?id=<YouTube video ID here>&type=<MIME type of the video you want to get>

Then you should see the video loads and the console shows the title of the video being loaded.
