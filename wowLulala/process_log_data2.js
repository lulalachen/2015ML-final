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
    to = 50000;

var dataset = [];

var line = 1;




function readFromFile(){

  lr.on('line', function(data){
    lr.pause();
    line++;

  });

  lr.on('error', function(err){
    callback(err, null);
  });

  lr.on('end', function(){
    console.log('Done');
    console.timeEnd('process');
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
