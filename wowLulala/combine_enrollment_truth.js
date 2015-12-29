var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util'),
    cli = require('cli-color');


var dataToBeGenerate = process.env.DATATYPE || 'train';
var target;
if (dataToBeGenerate === 'train')
  target = '../data/enrollment_train.csv';
else if (dataToBeGenerate === 'test')
  target = '../data/enrollment_test.csv';

fsp.readFile(target)
.then(function(chunck){
  // Convert into row-based dataset //
  var rows = chunck.toString().split('\n');
  var return_data = [];
  rows.forEach(function(row){
    var columns = row.split(',');
    return_data.push(columns);
  });
  // console.log('Finish row-based transformation.');
  if (dataToBeGenerate === 'test'){
    fsp.writeFile('../data/enrollment_test.json',JSON.stringify(return_data));
    console.log(cli.cyan("enrollment_test.json") + ' is generated.' );
    return null;
  }
  if (dataToBeGenerate === 'train')
    return readTruthTrain(return_data, '../data/truth_train.csv');
})
.then(function(data){
  if (data !== null) {
  // console.log(JSON.parse(JSON.stringify(data)));
    fsp.writeFile('../data/enrollment_train_with_y.json', JSON.stringify(data));
    console.log(cli.cyan("enrollment_train_with_y.json") + ' is generated.' );
  }
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