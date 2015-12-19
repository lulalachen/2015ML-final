var fsp = require('fs-promise'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird');

fsp.readFile('../data/sample_train_x.csv')
.then(function(chunck){
  // Convert into row-based dataset //
  var rows = chunck.toString().split('\n');
  var return_data = [];
  rows.forEach(function(row){
    var columns = row.split(',');
    return_data.push(columns);
  });
  console.log('Finish row-based transformation.');
  return readTruthTrain(return_data, '../data/truth_train.csv');
})
.then(function(data){
  // Convert into column-based dataset //
  var tempData = [];

  data[0].forEach(function(item){
    tempData.push({
      title : item,
      dataset : []
    });
  });

  for (var i = 1; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      tempData[j].dataset.push(data[i][j]);
    };
  };
  console.log('Finish column-based transformation.');
  return tempData;
})
.then(function(data){
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

  var path = './stats.json';
  fsp.writeFile(path, JSON.stringify(data), function(){
    console.log('Finish writing file into ' + path);
  });
})


function readTruthTrain (return_data, path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunck){
        var rows = chunck.toString().split('\n');
        return_data[0].push('y');
        for (var i = 1; i < return_data.length - 1 ; i++) {
          return_data[i].push(rows[i-1].split(',')[1]);
        };
        resolve(return_data); // resolve => return data
      })
  })
}