var fsp = require('fs-time-prefix');
var Promise = require('bluebird');
var stats = require("stats-lite");
var ml = require('machine_learning');

var target = ('train' === 'train')
            ? ['../data/sample_train_x_with_course_stats.csv','./results/logs.csv']
            : ['../data/sample_test_x_with_course_stats.csv','./results/logs_test.csv'];

fsp.readFile(target[0])
.then(function(chunk){
  var data = chunk.toString().split('\n');
  data.forEach(function(row,idx,arr){
    data[idx] = row.split(',');
  });
  return readAnother(data, target[1])
})
.spread(function(stats, log){
  console.log(stats[0]);
  console.log(log[0]);
})




function predict (classifier, path) {
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var data = JSON.parse(chunk);
      data.shift();
      var predicts = [];
      data.forEach(function(each, idx, arr){
        // predicts.push(classifier.predict(each));
        if (idx % 1000 === 0)
          console.log('Meow ' + idx);
        predicts.push(classifier.predict({
          x : each,
          k : 3,
          weightf : {type : 'gaussian', sigma : 10.0},
          distance : {type : 'euclidean'}
        }));
      })
      // predicts = classifier.predict(data);

      resolve(predicts);
    })
  })
}

function readAnother (data, path){
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var rows = chunk.toString().split('\n');
      var newData = [];
      rows.forEach(function (row) {
        newData.push(row.split(','));
      })

      // console.log(data[1]);
      resolve([data, newData]);
    })
  })
}

function getStats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentile = stats.percentile(input,0.2);
  };
  return (data.length !== 0) ? new statistics(data) : new statistics([0]);
}


function normalize (data) {
  var variance  = stats.variance(data);
  var mean      = stats.mean(data);
  data.forEach(function(val){
    if (variance !== 0){
      val -= mean;
      val /= variance;
    };
  });
}
