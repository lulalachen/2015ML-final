var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    _ = require('underscore'),
    util = require('util')
    Q = require('q');

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Modify Here Only //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
var datatype = 'train';

var lists_train = [
                    '../data/enrollment_log_histogram_train.csv'
                  ];
var lists_test  = [
                    '../data/enrollment_log_histogram_test.csv'
                  ];
var output = (datatype === 'train')
            ? '../data/sample_train_20160110_top25_plus_freq_histogram.csv'
            : '../data/sample_test_20160110_top25_plus_freq_histogram.csv';
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

var lists = (datatype === 'train') ? lists_train : lists_test;

var target = (datatype === 'train')
            ? '../data/sample_train_20160106_with_log_freq_top25.csv'
            : '../data/sample_test_20160106_with_log_freq_top25.csv';
console.time('Combine files')
lists.unshift(target);
var files = [];
lists.forEach(function(eachFile){
  files.push(combineFile(eachFile));
});

Q.all(files)
.then(function(files){
  var originalSample = files.shift(); // First file
  var finalData = originalSample;
  files.forEach(function(data){
    data.forEach(function(row, idx, arr){
      row.shift(); // Remove ID
      finalData[idx] = finalData[idx].concat(row);
    })
  })
  console.timeEnd('Combine files');
  return finalData;
})
.then(function(data){
  console.time('Writing files');
  var file = fsp.createWriteStream(output);
  data.forEach(function(row){
    var text = '';
    for (var i = 0; i < row.length; i++) {
      if (i === 0){
        text += row[i];
      } else {
        text += ',' + row[i];
      }
    };
    text += '\n';
    file.write(text);
  });
  console.timeEnd('Writing files');
});

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

