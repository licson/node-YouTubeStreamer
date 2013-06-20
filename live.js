// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
//
// This is the live streaming module for node-YouTubeStreamer.

//Require the libraries needed.
var m3u8 = require('m3u8');
var request = require('request');

//Here's our live stream handler.
//Currently only works with finished live streams
module.exports = function(data,res){
	//Create a M3U parser instance.
	//YouTube lists all possible streams in a M3U container.
	var parser = m3u8.createStream();
	//The selected stream
	var playlist;
	//Start piping data into the parser.
	request(data.hlsvp).pipe(parser);
	
	//The streaming function.
	//It writes each chunk to the output.
	var stream = function(){
		//The selected stream is segmented and each chunk's location is stored
		//in a M3U container.
		var parser = m3u8.createStream();
		//Start piping data in
		request(playlist).pipe(parser);
		
		//Write the appopriate response
		res.writeHead(200,{
			'Content-type': 'video/mp4'
		});
		
		//When a chunk arrives, send it to the client
		parser.on('item',function(item){
			var chunk = String(item.get('uri'));
			request(chunk,function(err,c_stream,data){
				if(err){
					return;
				}
				res.write(data);
			});
		});
	};
	
	//Check the available streams
	//and select them when ready
	parser.on('item',function(item){
		//Get the quality of each stream
		var quality = String(item.get('resolution')).split(',');
		//Only choose streams that are not HD
		//to save bandwidth
		if(parseInt(quality[0]) < 1280 && parseInt(quality[1]) < 720 && !playlist){
			playlist = String(item.get('uri'));
			//Start streaming
			stream();
		}
	});
};