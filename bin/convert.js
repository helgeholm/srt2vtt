var fs = require('fs');
var srt2vtt = require(__dirname + '/../index.js');

function stdinAsBuffer() {
  // Mostly copied from mklement0's:
  // http://stackoverflow.com/a/16048083/6848
  var chunksRead = [];
  var chunksTotalSize = 0;
  
  for (;;) {
    var BUFSIZE=256;
    var buf = new Buffer(BUFSIZE);
    var bytesRead = 0;
    try {
      bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE);
    } catch (e) {
      if (e.code == 'EAGAIN') { // 'resource temporarily unavailable'
        // Happens on OS X 10.8.3 (not Windows 7!), if there's no
        // stdin input - typically when invoking a script without any
        // input (for interactive stdin input).
        // If you were to just continue, you'd create a tight loop.
        throw new Error('interactive stdin input not supported.');
        process.exit(1);
      } else if (e.code == 'EOF') {
        // Happens on Windows 7, but not OS X 10.8.3:
        // simply signals the end of *piped* stdin input.
        break;          
      }
      throw e;
    }
    if (!bytesRead)
      break;
    chunksRead.push(buf);
    chunksTotalSize += bytesRead;
  }

  var input = new Buffer(chunksTotalSize);
  var inputPos = 0;
  for (var i = 0; i < chunksRead.length; i++) {
    chunksRead[i].copy(input, inputPos);
    inputPos += chunksRead[i].length;
  }
  return input;
}

var input = stdinAsBuffer();
srt2vtt(input, function(err, output) {
  if (err) throw err;
  console.log(output.toString());
});

