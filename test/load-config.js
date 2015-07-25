var mongo = require('mongodb').MongoClient;
var should = require("should");
var loadConfig = require("../load-config.js").loadConfig;
var url   = 'mongodb://localhost:27017/tests';

mongo.connect(url, function(err, db) {
  db.config.insert({
    inputFilenames: { $exists: true }
  }, {
    inputFilenames: [
      'test1.out',
      'test2.out',
      'test3.out'
    ]
  }, {
    upsert: true
  });

  db.close();
});

describe('load-config', function() {
  describe('loadConfig', function () {
     
    it('should return a list of filenames', function () {
      mongo.connect(url, function(err, db) {
        loadConfig(db, function(err, results) {
          results.should.exist.
            and.be.an.instanceOf(Array).
            and.not.have.lengthOf(0);
        });

        db.close();
      });
    });
  });
});