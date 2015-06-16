var cptable = require('codepage');
var utfx = require('utfx');

module.exports = {
  convertToUTF8: convertToUTF8
}

/* Default file encoding is CP1252.
 * Encoding can be UTF if a BOM is given.
 *
 * If defaultCodepageOverride is specified, that is used instead of CP1252
 * when no BOM is present.  Must be a numeric value.
 *
 * https://en.wikipedia.org/wiki/.srt#Text_encoding */ 
function convertToUTF8(buf, defaultCodepageOverride, next) {
  var defaultCodepage = defaultCodepageOverride || 1252;

  if (buf.length >= 3 &&
      buf[0] == 0xef && buf[1] == 0xbb && buf[2] == 0xbf) {
    // UTF8 - strip BOM
    next(null, buf.slice(3));

  } else if (buf.length >= 4 &&
             buf[0] == 0x00 && buf[1] == 0x00 && buf[2] == 0xfe && buf[3] == 0xff) {
    // UTF32BE - convert
    var src = buf.slice(4);
    var src_i = 0;
    var utf8bytes = [];
    var readCp = function() {
      if (src_i >= src.length)
        return null;
      return (src[src_i++] << 24) + (src[src_i++] << 16) + (src[src_i++] << 8) + src[src_i++];
    }
    var writeByte = function(cp) {
      utf8bytes.push(cp);
    }
    utfx.encodeUTF8(readCp, writeByte);
    next(null, new Buffer(utf8bytes));

  } else if (buf.length >= 4 &&
             buf[0] == 0xff && buf[1] == 0xfe && buf[2] == 0x00 && buf[3] == 0x00) {
    // UTF32LE - convert
    var src = buf.slice(4);
    var src_i = 0;
    var utf8bytes = [];
    var readCp = function() {
      if (src_i >= src.length)
        return null;
      return src[src_i++] + (src[src_i++] << 8) + (src[src_i++] << 16) + (src[src_i++] << 24);
    }
    var writeByte = function(cp) {
      utf8bytes.push(cp);
    }
    utfx.encodeUTF8(readCp, writeByte);
    next(null, new Buffer(utf8bytes));

  } else if (buf.length >= 2 &&
             buf[0] == 0xfe && buf[1] == 0xff) {
    // UTF16BE - convert
    var src = buf.slice(2);
    var src_i = 0;
    var utf8bytes = [];
    var readChar = function() {
      if (src_i >= src.length)
        return null;
      return (src[src_i++] << 8) + src[src_i++];
    }
    var writeByte = function(cp) {
      utf8bytes.push(cp);
    }
    utfx.encodeUTF16toUTF8(readChar, writeByte);
    next(null, new Buffer(utf8bytes));

  } else if (buf.length >= 2 &&
             buf[0] == 0xff && buf[1] == 0xfe) {
    // UTF16LE - convert
    var src = buf.slice(2);
    var src_i = 0;
    var utf8bytes = [];
    var readChar = function() {
      if (src_i >= src.length)
        return null;
      return src[src_i++] + (src[src_i++] << 8);
    }
    var writeByte = function(cp) {
      utf8bytes.push(cp);
    }
    utfx.encodeUTF16toUTF8(readChar, writeByte);
    next(null, new Buffer(utf8bytes));

  } else {
    // No BOM means default code page (normally CP1252) - convert
    var converted = new Buffer(cptable.utils.decode(defaultCodepage, buf));
    next(null, converted);
  }
}
