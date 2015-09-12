var fs = require('fs');
var through2 = require('through2');

var loadConfig = function(db, callback) {
  findInputFilenames(db, function(err, updatedConfig) {
    if (err) throw err;

    callback(err, updatedConfig); 
  });
}

var readInputFile = function (filename) {
  var lineBuffer = '';
  var lineNumber = 0;
  var rs = fs.createReadStream(filename, {
    encoding: 'utf-8'
  });

  var pushLine = function(dst, filename, line) {
    dst.push({
      filename:       filename,
      fileLineText:   line,
      fileLineNumber: ++lineNumber
    });
  };

  var h = 0;
  return rs.pipe(through2.obj(function (chunk, enc, callback) {
    lineBuffer += chunk;

    if (chunk.indexOf('\n')) {
      var lines = lineBuffer.split('\n');

      var bufferEndsInNl = lineBuffer[lineBuffer.length-1] === '\n';
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (i === lines.length-1) {
          if (bufferEndsInNl) {
            pushLine(this, filename, line);
            lineBuffer = '';
          } 

        } else {
          pushLine(this, filename, line);
        }
      }

      if (bufferEndsInNl) {
        lineBuffer = '';
      
      } else {
        lineBuffer = lines[lines.length-1];
      }

    } 

    callback();

  }, function(callback) { // flush function
    if (lineBuffer) {
      pushLine(this, filename, lineBuffer);
    }

    callback();
  }));
}

var findInputFilenames = function(db, callback) {
  db.find(
    { inputFilenames: { $exists: true } },
    function(err, docs) {
      var config = {};
      if (docs && docs.length > 0) {
        config.inputFilenames = docs[0].inputFilenames;
      }

      callback(
        err ? err : null, 
        err ? null : config
      );
    }
  ); 
}

module.exports.loadConfig = loadConfig;
module.exports.readInputFile = readInputFile;