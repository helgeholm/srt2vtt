var EventEmitter = require('events').EventEmitter;

/* Returns an event emitter with a `start()` function.
 * The following events are emitted:
 * - subtitle { id, cue, lines }
 * - end
 * - error
 * After an error has been emitted, the emitter dies.
 */
module.exports = function reader(buf) {
  var emitter = new EventEmitter();

  function transformCue(cue) {
    var re = /,/;
    return cue.toString().replace(re, '.').replace(re, '.');
  }

  emitter.start = function start() {
    emitter.start = function noRestart() {
      throw new Error('Reader was start()-ed twice.  This is assumed to be unintentional.');
    }

    var buf_i = 0;

    var state = 'awaitingId';
    var subtitle = { id: null, cue: null, lines: [] };

    var lineBytes = [];
    
    for(;;) {
      if (buf_i >= buf.length) {
        // EOB
        if (state == 'awaitingTextLine') {
          // Let EOB imply EOL
          if (lineBytes.length > 0)
            subtitle.lines.push(new Buffer(lineBytes));
          emitter.emit('subtitle', subtitle);
        }
        if (state == 'awaitingCue')
          return emitter.emit('error', "Truncated last entry: missing cue");
        return emitter.emit('end');
      }
      
      var b = buf[buf_i++];
      
      // Ignore CR - it should always be followed by a LF
      if (b == 0x0d)
        continue;

      if (b == 0x0a) {
        // EOL! What could it mean!
        var line = new Buffer(lineBytes);
        
        if (state == 'awaitingId') {
          if (line.length == 0)
            continue; // skip extra blank lines between subtitles
          subtitle.id = line;
          lineBytes = [];
          state = 'awaitingCue';
          continue;
        }

        if (state == 'awaitingCue') {
          subtitle.cue = transformCue(line);
          lineBytes = [];
          state = 'awaitingTextLine';
          continue;
        }

        if (state == 'awaitingTextLine') {
          if (line.length == 0) {
            emitter.emit('subtitle', subtitle);
            subtitle = { id: null, cue: null, lines: [] };
            state = 'awaitingId';
            continue;
          }
          
          subtitle.lines.push(line);
          lineBytes = [];
          continue;
        }
      
      } else {
        // Not EOL - build line
        lineBytes.push(b);
      }
    }
  }

  return emitter;
}
