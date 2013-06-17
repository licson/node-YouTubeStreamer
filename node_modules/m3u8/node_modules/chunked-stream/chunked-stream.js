/*!
 * ChunkedStream
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Stream = require('stream').Stream
  , util = require('util')

/**
 * Exports.
 */

module.exports = ChunkedStream

/**
 * Chunked Stream
 *
 * - Buffers and rechunks on a specific character, by default '\n'.
 */


function ChunkedStream (matcher, passEmpty) {
  if (!(this instanceof ChunkedStream)) return new ChunkedStream(matcher, passEmpty)

  if (typeof matcher === 'undefined') {
    matcher = '\n'
  }

  this.matcher = matcher
  this.passEmpty = passEmpty
  this.buffer = ''

  this.writable = true
  this.readable = true
}

util.inherits(ChunkedStream, Stream)


ChunkedStream.prototype.write = function (chunk) {
  chunk = chunk.toString()
  var len = chunk.length
    , i = 0

  while (i < len) {
    var char = chunk[i].toString()
    this.buffer += char
    if (char == this.matcher) {
      var data = this.buffer
      this.buffer = ''
      if (!this.passEmpty && data == this.matcher) {
        return true // skip
      }
      this.emit('data', data)
    }
    i++
  }
  return true
}

ChunkedStream.prototype.end = function () {
  if (this.buffer) {
    this.emit('data', this.buffer)
  }
  this.emit('end')
}
