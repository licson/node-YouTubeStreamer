// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
//
// Streams YouTube video to clients using a proxy-like implantation.

//Load required modules in
var http = require('http');
var request = require('request');
var url = require('url');
var qs = require('querystring');

//Streaming component
/** ** THIS IS YOUTUBE LIVE STREAMING COMPONENT (NOT COMPLETED) ** **/
var live = require('./live.js');
/** ** THIS IS YOUTUBE NORMAL VIDEO STREAMING ** **/
var normal = require('./normal.js');

//node.js cluster module
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

//Where should we listen for requests?
var IP = process.argv[2] || '127.0.0.1';
var PORT = Number(process.argv[3] || 8000);

//If this is the master process, fork child process
if(cluster.isMaster){
	//Fork based on the number of CPUs
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	
	//Check for the child's states and restart them if died
	cluster.on('exit', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
		cluster.fork();
	});
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is ready!');
		cluster.fork();
	});
	
	//node.js 0.6 compatibility
	cluster.on('death', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
	});
}
else{
	//We're in the child process. Start the HTTP server.
	var server = http.createServer(function(req,res){
		//Get the `video ID` and `video type` from the query
		var data = url.parse(req.url,true).query;
		data.type = data.type || 'video/mp4';
		
		//Let's make an request to `http://www.youtube.com/get_video_info?video_id=<VIDEO_ID_HERE>`
		//to get some metadata. This is reverse-engineered from the Youtube embed player.
		request('http://www.youtube.com/get_video_info?video_id='+data.id,function(err,d_res,d_content){
			//Check if there's any error
			if(!err && d_res.statusCode === 200){
				//No error happened.
				//Start parsing the content of the returned result.
				d_content = qs.parse(d_content);
				
				//If there's an API error _(such as copyright restrictions, video not allowed to embed, etc.)_
				//end the request with an error message.
				if(d_content.status.indexOf('ok') == -1){
					res.end(d_content.reason);
				}
				else {
					//There's no API errors, start getting information from it.
					
					//Log the video's title
					console.log('Requesting video "%s"',d_content.title);
					
					//Check whether the video is a YouTube live stream
					if((!!d_content.ps) && d_content.ps == "live"){
						//It's a live stream, let's call our live stream handler.
						//Tricky things **WILL** happen here.
						live(d_content,res);
					}
					else {
						//It's just a normal video, stream it to the client using the conventional approch.
						normal(data,d_content)(res);
					}
				}
			}
			else {
				//An error happened, end the connection.
				console.log('Error getting video metadata: ',err);
				res.end();
			}
		});
	});
	
	//Listen on the specified IP and port.
	server.listen(PORT,IP,function(){
		console.log('Server #%d listening at %s:%d',process.pid,IP,PORT);
	});
}