var http = require('http');
var request = require('request');
var url = require('url');
var qs = require('querystring');

var server = http.createServer(function(req,res){
	var data = url.parse(req.url,true).query;
	data.type = data.type || 'video/mp4';
	request('http://www.youtube.com/get_video_info?video_id='+data.id,function(err,d_res,d_content){
		if(!err && d_res.statusCode === 200){
			d_content = qs.parse(d_content);
			console.log('Requesting video "%s"',d_content.title);
			var streams = String(d_content.url_encoded_fmt_stream_map).split(',');
			for(var i = 0; i < streams.length; i++){
				var stream = qs.parse(streams[i]);
				if(String(stream.type).indexOf(data.type) > -1 && (stream.quality == "large" || stream.quality == "medium" || stream.quality == "small")){
					request(stream.url+'&signature='+stream.sig).pipe(res);
					break;
				}
			}
		}
		else {
			console.log('Error getting video metadata: ',err);
		}
	});
});
server.listen(8000,'127.0.0.1',function(){
	console.log('Server listening at %s:%d','127.0.0.1',8000);
});