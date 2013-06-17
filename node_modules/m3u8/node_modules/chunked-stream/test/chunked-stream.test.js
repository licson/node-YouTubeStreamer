var assert = require('assert')
  , mocha = require('mocha')
  , Stream = require('stream').Stream
  , ChunkedStream = require('..')

//console.dir(ChunkedStream)

describe('ChunkedStream', function () {

  describe('ChunkedStream', function () {
    var chunkedStream = ChunkedStream()

    it('should be a ChunkedStream', function (done) {
      assert.ok(chunkedStream instanceof ChunkedStream)
      done()
    })
    it('should be a Stream', function (done) {
      assert.ok(chunkedStream instanceof Stream)
      done()
    })
    it('should accumulate the value written to it', function (done) {
      chunkedStream.on('data', function (data) {
        assert.deepEqual(data, 'cool story\n')
        done()
      })
      chunkedStream.write('cool story\nbro')
    })
  })

})