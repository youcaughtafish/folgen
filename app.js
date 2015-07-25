var mongo = require('mongodb').MongoClient;
var url   = 'mongodb://localhost:27017/schnell';
mongo.connect(url, function(err, db) {
  
  db.close();
});