var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var target = ('train' === 'train')
            ? '../data/log_train.csv'
            : '../data/log_test.csv';

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(target);
console.time('process');

var lists = [

]

var files = [];
lists.forEach(function(eachFile){
  files.push(combineFile(eachFile));
});


var line = 1;
var title = [ 'enrollment_id', 'time', 'source', 'event', 'object' ];

var currentId = 0;

lr.on('line', function(data){
  lr.pause();
  line++;
  var row = data.toString().split(',');

  if (row[0] === currentId){

  } else {
    currentId = row[0];
    if (currentId === 0)
      return;

  }

  lr.resume();
});

lr.on('error', function(err){
  callback(err, null);
});

lr.on('end', function(){
  console.timeEnd('process');
});


function combineFile (path) {
  var deferred = Q.defer();
  fsp.readFile(path)
  .then(function(chunk) {
    var data = chunk.toString().split('\n');
    var newRows = [];
    data.forEach(function(row){
      if (row.split(',').length > 0)
        newRows.push(row.split(','));
    });
    deferred.resolve(newRows);
  });
  return deferred.promise;
}


function getStats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentileOfEightyFive = stats.percentile(input,0.7);
  };
  return (data.length !== 0) ? new statistics(data) : new statistics([0]);
}
