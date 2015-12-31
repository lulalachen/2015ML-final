var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var loglist = require('./models/log');

var target = (process.env.DATATYPE || 'train' === 'train') ? '../data/log_train.csv' : '../data/log_test.csv';

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(target);

var from = 1,
    to = 2000;

var dataset = [];

readFromFile(from, to, dataset, processFunction, function(err, data){
  if (err)
    return console.log(err);
  var dataset = loglist.display();

  console.log('===== Time Distribution Along Enrollments =====');
  for (var i = 0; i < dataset.logs.length; i++) {
    var dist = dataset.logs[i].timeDistribution();
    console.log('===== ' + dataset.logs[i].enrollment_id + ' =====');
    console.log(getStats(dist));
  };

  console.log('\n\n');

  console.log('===== Time Distribution Along Enrollments =====');
  for (var i = 0; i < dataset.logs.length; i++) {
    var dist = dataset.logs[i].timeGapByDays();
    console.log('===== ' + dataset.logs[i].enrollment_id + ' =====');
    console.log(getStats(dist));
  };

  console.timeEnd('process');
  // fsp.writeJsonFile('./results/course.json', data);
})

function processFunction (rows, dataset){
  // console.log('processing~~~');
  console.time('process');

  loglist.input(rows);
}

var line = 0;
function readFromFile(offsets, limits, dataset, processor, callback){

  lr.on('line', function(data){
    lr.pause();
    line++;
    var rows = data.toString().split(',');
    if (line <= offsets){
      // Skip process
      lr.resume();
      // console.log('skip process');
    }
    else if (line <= limits) {
      lr.resume();
      processor(rows, dataset);
      // console.log('process');
    }
    else{
      lr.end();
    }
  });

  lr.on('error', function(err){
    callback(err, null);
  });

  lr.on('end', function(){
    console.log('Done');
    callback(null, dataset);
  });
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
