var assert = require('assert');

var loadConfig = function(db, callback) {
  var collection = db.collection('config');

  collection.find({
    inputFilenames: { $exists: true }
  }).toArray(function(err, items) {
    if (!err) {
      callback(err, null);

    } else {
      callback(null, items);
    }
  }); 
}

module.exports.loadConfig = loadConfig;