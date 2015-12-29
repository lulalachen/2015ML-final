var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

fsp.readFile('./results/course.json')
.then(function(chunk){
  return JSON.parse(chunk);
})
.then(function(data){
  var courses = data.courses;
  var counts = [];
  courses.forEach(function(each, idx, arr){
    var temp = {};
    for (var i = 0; i < each.modules.length; i++) {
      if (!temp[each.modules[i].category]){
        temp[each.modules[i].category] = 0;
        temp[each.modules[i].category]++;
      } else {
        temp[each.modules[i].category] ++;
      }
    };
    counts.push({
      id : each.courseIdRaw,
      stats : temp
    });
  })
  // fsp.writeJsonFile('./results/course_stats.json',counts);

  return counts;
})
.then(function(data){
  for (var i = 0; i < data.length; i++) {
    var stats = data[i].stats;
    for (var j = 0; j < Object.keys(stats).length; j++) {
      var field = Object.keys(data[i].stats)[j];

    };
  };

})


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