var assert = require('assert');
var fs = require('fs');

var srt2vtt = require(__dirname + '/../index');

describe("srt2vtt", function () {
    function checkFile(testId, next) {
        var input = fs.readFileSync(__dirname + '/data/' + testId + '.srt', {'encoding': null});
        var expected = fs.readFileSync(__dirname + '/data/' + testId + '.vtt', {'encoding': null});
        srt2vtt(input, function(err, output) {
            if (err)
                return next(err);
            function errinate(what) {
                console.log("OUTPUT:", output.toString());
                console.log("EXPECT:", expected.toString());
                next(what);
            }
            for (var i = 0; i < output.length; i++) {
                if (expected[i] != output[i]) {
                    var os = output.slice(i, i + 20);
                    var es = expected.slice(i, i + 20);
                    return errinate("Unexpected output at byte " + i + ": " + es[0] + " != " + os[0] + " - " + JSON.stringify(es) + " != " + JSON.stringify(os));
                }
            }
            if (i < expected.length) {
                var es = expected.slice(i, i + 20);
                return errinate("Result shorter than expected.  Expected more: " + JSON.stringify(es) + ": " + es.toString());
            }
            return next();
        });
    }

    it("Can be required", function (done) {
        assert.ok(srt2vtt);
        done();
    });

    it("Handles LF-only input files", function (done) {
        checkFile('lfonly', done);
    });

    it("Does not re-encode input if it is already UTF8", function (done) {
        checkFile('preserve-broken-utf8', done);
    });

    it("Can translate a simple .srt file", function (done) {
        checkFile('simple', done);
    });

    it("Correctly interprets default CP1252 encoded files", function (done) {
        checkFile('understand-cp1252', done);
    });

    it("Correctly interprets default UTF16BE encoded files", function (done) {
        checkFile('utf16be', done);
    });

    it("Correctly interprets default UTF16LE encoded files", function (done) {
        checkFile('utf16le', done);
    });

    it("Correctly interprets default UTF32BE encoded files", function (done) {
        checkFile('utf32be', done);
    });

    it("Correctly interprets default UTF32LE encoded files", function (done) {
        checkFile('utf32le', done);
    });
});
