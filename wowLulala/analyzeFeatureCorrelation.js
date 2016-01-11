var Correlation = require('node-correlation');
var fsp = require('fs-time-prefix');
var Q = require('q');
var dir = require('node-dir');
var stats = require('stats-lite');
var files = [];


///////  Read File List /////////
var path = '../allResults/Track2';
/////////////////////////////////


readFileList(function(err, fileList){
  if (err)
    console.log(err);
  console.time('Process')

  fileList.forEach(function(eachFile){
    files.push(combineFile(eachFile.replace(' ','\ ')));
  });

  Q.all(files)
  .then(function(files){
    var fw = fsp.createWriteStream('./results/combineAllSubmitted_track2.csv');
    var ID = [];
    // var serializedFileName = [];

    for (var i = 0; i < files[0].length; i++) {
      ID.push(files[0][i][0]);
    };

    var text = '';

    for (var i = 0; i < files[0].length; i++){
      text += ID[i]
      for (var j = 0; j < files.length; j++){
        text += ',' + files[j][i][1]
      }
      text += '\n';
      // console.log(text);
      fw.write(text);
      text = '';
    }
    console.timeEnd('Process')

  });

});


function readFileList (cb) {
  // match only filenames with a .txt extension and that don't start with a `.´
  dir.readFiles(path, {
    match: /.csv$/,
    exclude: /^\./
    }, function(err, content, next) {
        if (err) throw err;
        // console.log('content:', content);
        next();
    },
    function(err, fileList){
        if (err)
          cb(err, null);
        // console.log('finished reading fileList:',fileList);
        cb(null, fileList);
    }
  );
}




function combineFile (path) {
  var deferred = Q.defer();
  fsp.readFile(path)
  .then(function(chunk) {
    var data = chunk.toString().split('\n');
    var newRows = [];
    data.forEach(function(row){
      newRows.push(row.split(','));
    });
    deferred.resolve(newRows);
  });
  return deferred.promise;
}
