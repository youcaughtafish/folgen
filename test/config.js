var mongo = require('mongodb').MongoClient;
var should = require("should");
var fs = require('fs');
var loadConfig = require("../src/config.js").loadConfig;
var readInputFile = require("../src/config.js").readInputFile;

var url   = 'mongodb://localhost:27017/tests';

var inputFiles = {
  'test1.log': "one\ntwo\n\nfour\nfive",
  'test2.log': "[12:12:12T02/02/02] [INFO] - blah 127.0.0.1 blah blah <xml>\n" +
               "[12:12:13T02/02/02] [DEBUG] - <xml>",
  'test3.log': "[12:12:12T02/02/02] [INFO] - blah 127.0.0.1 blah blah <xml>\n" +
               "[12:12:13T02/02/02] [DEBUG] - <xml>\n"+
               "[12:12:14T02/02/02] [INFO] - blah 127.0.0.1 blah blah <xml>\n" +
               "[12:12:15T02/02/02] [DEBUG] - <xml>\n"
};


mongo.connect(url, function(err, db) {
  db.config.insert({
    inputFilenames: { $exists: true }
  }, {
    inputFilenames: Object.keys(inputFiles)
  }, {
    upsert: true
  });

  db.close();
});

for (var eaFilename in inputFiles) {
  fs.writeFile("./test/"+eaFilename, inputFiles[eaFilename], function(err) {
    if (err) throw err;
  });
}

describe('load-config', function() {
  describe('loadConfig', function () {
    it('should return a list of filenames', function () {
      mongo.connect(url, function(err, db) {
        loadConfig(db, function(err, config) {
          config.inputFilenames.should.exist.
            and.be.an.instanceOf(Array).
            and.not.have.lengthOf(0);
        });

        db.close();
      });
    });
  });

  describe('readInputFile', function () {
    it('should read the input file', function(done) {
      var lines = [];
      readInputFile('test/'+Object.keys(inputFiles)[0]).
        on('data', function(obj) {
          lines.push(obj);
        }).
        on('end', function() {
          lines.should.have.lengthOf(5);

          done();
        });
    });
  });
});