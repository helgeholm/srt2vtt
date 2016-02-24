var encoding = require('./encoding');
var reader = require('./reader');

function convert(buf, defaultCodepageOverride, next) {
  // Handle defaultCodepageOverride being optional.
  if (next == undefined) {
    next = defaultCodepageOverride;
    defaultCodepageOverride = undefined;
  }

  var outputLines = [
  'WEBVTT',
  '',
  'NOTE Converted from .srt via srt2vtt: https://github.com/deestan/srt2vtt'
  ];

  var r = reader(buf);
  r.on('error', next);
  r.on('subtitle', function(subtitle) {
    outputLines.push('');
    outputLines.push(subtitle.id);
    outputLines.push(subtitle.cue);
    outputLines = outputLines.concat(subtitle.lines);
  });
  r.on('end', function() {
    var outLen = 0;
    outputLines.forEach(function(line) { outLen += line.length + 1; });
    var output = new Buffer(outLen);
    for (var i = 0, pos = 0;
      i < outputLines.length; i++) {
        var lineBuf = outputLines[i];
        if (!Buffer.isBuffer(lineBuf))
          lineBuf = new Buffer(lineBuf);
          lineBuf.copy(output, pos);
          pos += outputLines[i].length;
          output[pos] = 10;
          pos += 1;
        }
        next(null, output);
    });
    r.start();
}

module.exports = function srt2vtt(buf, defaultCodepageOverride, next) {
  // Handle defaultCodepageOverride being optional.
  if (next == undefined) {
    next = defaultCodepageOverride;
    defaultCodepageOverride = undefined;
  }

  encoding.convertToUTF8(buf, defaultCodepageOverride, function(err, utf8buf) {
    if (err) return next(err);
    return convert(utf8buf, next);
  });
};

module.exports.raw = convert;
