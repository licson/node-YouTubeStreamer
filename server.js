/*
*
*/

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

//Cluster
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var IP = process.argv[2] || '127.0.0.1';
var PORT = process.argv[1] || 8000;

if(cluster.isMaster){
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
	});
	cluster.on('death', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
	});
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is ready!');
	});
}
else{
	var server = http.createServer(function(req,res){
		var data = url.parse(req.url,true).query;
		data.type = data.type || 'video/mp4';
		request('http://www.youtube.com/get_video_info?video_id='+data.id,function(err,d_res,d_content){
			if(!err && d_res.statusCode === 200){
				d_content = qs.parse(d_content);
				if(d_content.status.indexOf('ok') == -1){
					res.end(d_content.reason);
				}
				else {
					console.log('Requesting video "%s"',d_content.title);
					if((!!d_content.ps) && d_content.ps == "live"){
						live(data,d_content);
					}
					else {
						normal(data,d_content)(res);
					}
				}
			}
			else {
				console.log('Error getting video metadata: ',err);
				res.end();
			}
		});
	});
	server.listen(8000,'127.0.0.1',function(){
		console.log('Server %d listening at %s:%d',process.pid,'127.0.0.1',8000);
	});
}