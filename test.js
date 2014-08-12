var fs = require('fs');

var srt2vtt = require('./index');

fs.readFile('example.srt', {'encoding': null}, opened);

function opened(err, data) {
  srt2vtt(data, function(err, output) {
    console.log(output.toString());
  });
}
