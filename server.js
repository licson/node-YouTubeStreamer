// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
// 
// Streams YouTube video to clients using a proxy-like implantation.

// Load required modules in
var http = require('http');
var streamer = require('./index.js');

// node.js cluster module
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

// Where should we listen for requests?
var IP = process.argv[2] || '127.0.0.1';
var PORT = Number(process.argv[3] || 8000);

// If this is the master process, fork child process
if(cluster.isMaster){
	// Fork based on the number of CPUs
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	
	// Check for the child's states and restart them if died
	cluster.on('exit', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
		cluster.fork();
	});
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is ready!');
	});
	
	// node.js 0.6 compatibility
	cluster.on('death', function(worker, code) {
		console.log('Worker ' + worker.process.pid + ' died with code '+code);
		cluster.fork();
	});
}
else{
	// We're in the child process. Start the HTTP server.
	var server = http.createServer(streamer());
	
	// Listen on the specified IP and port.
	server.listen(PORT,IP,function(){
		console.log('Server #%d listening at %s:%d',process.pid,IP,PORT);
	});
}