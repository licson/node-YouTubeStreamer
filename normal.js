var request = require('request');
var qs = require('querystring');

module.exports = function(query,data){
	var streams = String(data.url_encoded_fmt_stream_map).split(',');
	for(var i = 0; i < streams.length; i++){
		var stream = qs.parse(streams[i]);
		if(String(stream.type).indexOf(query.type) > -1 && (stream.quality == "large" || stream.quality == "medium" || stream.quality == "small")){
			return function(res){
				request(stream.url+'&signature='+stream.sig).pipe(res);
			};
		}
	}
};