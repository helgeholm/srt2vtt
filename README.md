# srt2vtt

[![NPM](https://nodei.co/npm/srt2vtt.png)](https://nodei.co/npm/srt2vtt/)

Encoding-aware .srt (SubRip Text) to .vtt (WebVTT) converter.

Handles CP1252 and UTF8/16/16LE/32/32LE.

## Quick Example

```javascript
var fs = require('fs');
var srt2vtt = require('srt2vtt');

var srtData = fs.readFileSync('captions.srt');
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
### srt2vtt (srtBuffer, defaultCodepageOverride, callback)

It assumes input `srtBuffer` has the default CP1252 encoding, unless a UTF8, UTF16, UTF16LE, UTF32, or UTF32LE BOM is found at the start.

If the `defaultCodepageOverride` is given, that codepage is used instead of CP1252.

Callback is assumed to be a `function(error, vttBuffer)`.

__Arguments__

* srtBuffer - `Buffer` containing the .srt file.
* defaultCodepageOverride (optional) - `int` number of codepage to use instead of CP1252 when no UTF BOM is found.  This must be a numeric value, so e.g. give `1256` for codepage CP1256 (Arabic).
* callback - `function(error, vttBuffer)`, in which `error` will be `null` if the conversion were successful, or an error message if not successful.  `vttBuffer` is a UTF8-encoded buffer containing the converted WEBVTT file data.

<a name="convert" />
### bin/convert.js

A command-line utility that expects a `.srt` file in `stdin`, will transform it to `.vtt`, and send it to `stdout`.

__Example__

```
$ node bin/convert.js < mighty_jack.srt > mighty_jack.vtt
```
