// cache and hash process
var cacheAndHash = function(sqlIdentifiers, sqlTableName) {
  // find all rows from the sql table
  findInSqlDb(
    'select * from ' + sqlTableName,
    function(err, rows) {
      // upsert all rows in the mongo
      // table given the row hash
      for (var row in rows) {
        var rowDoc = createDocument(row);

        cache[sqlTableName].update(
          { hash: rowDoc.hash },
          rowDoc,
          { upsert: true }
        );
      }
    }
  );
};

var createDocument = function(row) {
  return {
    hash: hash(row),
    data: row,
    updated:  false,
    inserted: false,
    deleted:  false
  };
}

// update process
var updateModified = function(identifiers, tableName) {
  // find all rows from the sql table
  findInSqlDb(
    'select * from ' + sqlTableName,
    function(err, rows) {
      // upsert all rows into mongo
      // setting the inserted/updated
      // flags as appropriate
      for (var row in rows) {
        var rowDoc = createDocument(row);
        rowDoc.updated = true;
        cache[sqlTableName].update(
          { hash: rowDoc.hash },
          { 
            $set: rowDoc,
            $setOnInsert { 
              inserted: true,
              updated:  false,
            },
          },
          { upsert: true }
        );
      }
    }
  );

  cache[tableName].find(
    { updated: 'true' },
    function(err, result) {
      // update
    }
  );

  cache[tableName].find(
    { inserted: 'true' },
    function(err, result) {
      // inserted
    }
  );

  cache[tableName].find(
    { deleted: 'true' },
    function(err, result) {
      // deleted
    }
  );
};