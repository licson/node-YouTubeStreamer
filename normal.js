// # node-YouTubeStreamer
// _by Licson Lee <licson@gmail.com>_
//
// This is the normal streaming module for node-YouTubeStreamer.

//Require the libraries needed.
var request = require('request');
var qs = require('querystring');

//Here's our normal stream handler.
module.exports = function(query,data){
	//Get the streams from the API response
	var streams = String(data.url_encoded_fmt_stream_map).split(',');
	//Loop througn all streams
	for(var i = 0; i < streams.length; i++){
		//Parse the stream
		var stream = qs.parse(streams[i]);
		//If the stream is compatable with the video type,
		//we return a function that can stream the video to the client.
		//Note: we **DO NOT** stream HD videos to save bandwidth.
		if(String(stream.type).indexOf(query.type) > -1 && (stream.quality == "large" || stream.quality == "medium" || stream.quality == "small")){
			return function(res){
				request(stream.url+'&signature='+stream.sig).pipe(res);
			};
		}
	}
	//No streams can be found with the format specified
	//Return an error message
	return function(res){
		res.end("No compatable streams can be found!");
	};
};