var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var target = ('train' === 'train')
            ? ['../data/log_train.csv', '../data/sample_train_with_adjusted_course_stats.csv', '../data/enrollTime_train.csv']
            : ['../data/log_test.csv', '../data/sample_test_with_adjusted_course_stats.csv', '../data/enrollTime_test.csv'];

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(target[0]);

var line = 0;

var list = [];
var fileStream = fsp.createWriteStream(target[2]);
var tempId = 'init';
console.time('process')
lr.on('line', function(data){
  lr.pause();
  line++;
  var row = data.split(',');

  // Initialize
  if (tempId === 'init'){
    tempId = row[0];
    list.push({
      id    : row[0],
      start : row[1]
    });
  }

  if (tempId !== row[0]){
    list.push({
      id    : row[0],
      start : row[1]
    });
    tempId = row[0];
  }

  if (list.length % 100 === 0){
    var text = '';
    list.forEach(function(each){
      text += each.id + ',' + each.start + '\n';
    });
    fileStream.write(text);
    list = [];
  }
  lr.resume();
});

lr.on('error', function(err){
  reject(err);
});

lr.on('end', function(){
  var text = '';
  list.forEach(function(each){
    text += each.id + ',' + each.start + '\n';
  });
  fileStream.write(text);
  list = [];
  console.timeEnd('process');
});


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
