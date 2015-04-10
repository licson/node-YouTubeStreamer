// # node-YouTubeStreamer
// _by Licson Lee <licson0729@gmail.com>_
//
// This is the options file for node-YouTubeStreamer.

var options = module.exports = {
	// # Allows audio conversion using FFMpeg?
	// 
	// Make sure you have FFMpeg installed before using this!
	// 
	// Default: `false`
	convertAudio: true,
	// # Stream HD videos?
	// 
	// This may increase the bandwidth used.
	// 
	// Default: `false`
	useHDVideos: true,
	// # Stream live broadcasts?
	// 
	// This is *VERY* experimental.
	// 
	// Default: `false`
	liveStreaming: false
};