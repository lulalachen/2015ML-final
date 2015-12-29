var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util'),
    cli = require('cli-color');

fsp.readFile('../data/sample_train_x.csv')
.then(function(chunck){
  // Convert into row-based dataset //
  var rows = chunck.toString().split('\n');
  var return_data = [];
  rows.forEach(function(row){
    var columns = row.split(',');
    return_data.push(columns);
  });
  // console.log('Finish row-based transformation.');
  return readTruthTrain(return_data, '../data/truth_train.csv');
})
.then(function(data){
  fsp.writeJsonFile('../data/sample_train_x_with_y.json', data);
  console.log(cli.cyan("sample_train_x_with_y.json") + ' is generated.' );
})

function readTruthTrain (return_data,path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunck){
        var rows = chunck.toString().split('\n');
        return_data[0].push('y');
        for (var i = 1; i < return_data.length - 1 ; i++) {
          return_data[i].push(rows[i-1].split(',')[1]);
        };
        for (var i = 0; i < return_data.length; i++) {
          if (return_data[i].length === 0)
            delete return_data[i];
        };
        resolve(return_data); // resolve => return data
      })
  })
}