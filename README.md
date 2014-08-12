# srt2vtt

[![NPM](https://nodei.co/npm/srt2vtt.png)](https://nodei.co/npm/srt2vtt/)

Encoding-aware .srt (SubRip Text) to .vtt (WebVTT) converter.

Handles CP1252 and UTF8/16/16LE/32/32LE.

## Quick Example

```javascript
var fs = require('fs');
var srt2vtt = require('srt2vtt');

var srtData = fs.readFileSnyc('captions.srt');
srt2vtt(srtData, function(err, vttData) {
  if (err) throw new Error(err);
  fs.writeFileSync('captions.vtt', vttData);
});
```

<a name="download" />
## Download

For [Node.js](http://nodejs.org/), use [npm](http://npmjs.org/):

    npm install srt2vtt

## Documentation

<a name="srt2vtt" />
### srt2vtt (srtBuffer, callback)

It assumes input `srtBuffer` has the default CP1252 encoding, unless a UTF8, UTF16, UTF16LE, UTF32, or UTF32LE BOM is found at the start.

Callback is assumed to be a `function(error, vttBuffer)`.

__Arguments__

* srtBuffer - `Buffer` containing the .srt file.
* callback - `function(error, vttBuffer)`, in which `error` will be `null` if the conversion were successful, or an error message if not successful.  `vttBuffer` is a UTF8-encoded buffer containing the converted WEBVTT file data.
