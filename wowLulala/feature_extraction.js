var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('../data/object.csv');
var Courses = require('./models/courses');

var dataset = new Courses();

var line = 0;

// All 27250 ; first 468
readFromFile(1,468,processFunction,function(err, data){
  if (err)
    return console.log(err);
  // data.constructMap();
  fsp.writeJsonFile('./results/course.json', data);
})

function processFunction (rows, dataset){
  dataset.addCourse(rows)
  // console.log('processing~~~');
}

function readFromFile(offsets, limits, processor, callback){
  var dataset = new Courses();

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
    // console.log('Dataset length : ' + dataset.length);
    // fsp.writeTimePrefix('./results')
    console.log('Done');
    callback(null, dataset);
  });
}


function stats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentileOfEightyFive = stats.percentile(input,0.85);
  };

  for (var i = 0; i < data.length; i++) {
    data[i].stats = new statistics(data[i].dataset);
    delete data[i].dataset;
  };
  console.log('Finish calculating stats.');
  return data;
}

function readTruthTrain (return_data, path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunk){
        var rows = chunk.toString().split('\n');
        return_data[0].push('y');
        for (var i = 1; i < return_data.length - 1 ; i++) {
          return_data[i].push(rows[i-1].split(',')[1]);
        };
        resolve(return_data); // resolve => return data
      })
  })
}