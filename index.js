// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
//
// Streams YouTube video to clients using a proxy-like implantation.

var url = require('url');
var qs = require('querystring');
var request = require('request');

// Streaming component
var live = require('./live.js');
var normal = require('./normal.js');

var streamer = function(req, res, opts){
	// Get the `video ID` and `video type` from the query
	var data = url.parse(req.url,true).query;
	data.type = data.type || 'video/mp4';
	
	// Let's make an request to `http:// www.youtube.com/get_video_info?video_id=<VIDEO_ID_HERE>`
	// to get some metadata. This is reverse-engineered from the Youtube embed player.
	request('http://www.youtube.com/get_video_info?video_id='+data.id,function(err,d_res,d_content){
		// Check if there's any error
		if(!err && d_res.statusCode === 200){
			// No error happened.
			// Start parsing the content of the returned result.
			d_content = qs.parse(d_content);
			
			// If there's an API error _(such as copyright restrictions, video not allowed to embed, etc.)_
			// end the request with an error message.
			if(d_content.status.indexOf('ok') == -1){
				res.end(d_content.reason);
			}
			else {
				// There's no API errors, start getting information from it.
				
				// Log the video's title
				console.log('Requesting video "%s"',d_content.title);
				
				// Check whether the video is a YouTube live stream
				if((!!d_content.ps) && d_content.ps == "live"){
					// It's a live stream, let's call our live stream handler.
					// Tricky things **WILL** happen here.
					live(d_content, res ,opts);
				}
				else {
					// It's just a normal video, stream it to the client using the conventional approch.
					normal(data, d_content, opts)(res);
				}
			}
		}
		else {
			// An error happened, end the connection.
			console.log('Error getting video metadata: ',err);
			res.end();
		}
	});
};

module.exports = function(opts){
	var _opts = require('./options.js');
	if(opts){
		for(var i in opts){
			_opts[i] = opts[i];
		}
	}
	
	return function(req, res){
		streamer(req, res, _opts);
	};
};