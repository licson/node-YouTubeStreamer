// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
//
// This is the normal streaming module for node-YouTubeStreamer.

//Require the libraries needed.
var request = require('request');
var qs = require('querystring');
var spawn = require('child_process').spawn;

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
				/* Enable Real-time audio conversion by uncomment the line below (requires ffmpeg!) */
				/*if(!!query.audio){
					var ffmpeg = spawn('ffmpeg',['-i','-','-vn','-ac',2,'-ar',44100,'-ab','128k','-f','mp3','-']);
					var video = request(stream.url+'&signature='+stream.sig);
					video.pipe(ffmpeg.stdin);
					ffmpeg.stdout.pipe(res);
					return;
				}*/
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