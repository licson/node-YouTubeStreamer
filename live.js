var m3u8 = require('m3u8');
var request = require('request');

module.exports = function(data,res){
	var parser = m3u8.createStream();
	var playlist;
	request(data.hlsvp).pipe(parser);
	
	parser.on('item',function(item){
		var quality = String(item.get('resolution'));
		if(parseInt(quality.split(',')[0]) < 1280 && parseInt(quality.split(',')[1]) < 720 && !playlist){
			playlist = String(item.get('uri'));
		}
	});
};