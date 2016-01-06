var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util'),
    cli = require('cli-color');

var dataToBeGenerate = process.env.DATATYPE || 'train';
var target;
if (dataToBeGenerate === 'train')
  target = '../data/sample_train_x.csv';
else if (dataToBeGenerate === 'test')
  target = '../data/sample_test_x.csv';

fsp.readFile(target)
.then(function(chunck){
  // Convert into row-based dataset //
  var rows = chunck.toString().split('\n');
  var return_data = [];
  rows.forEach(function(row){
    var columns = row.split(',');
    var temp = [];
    columns.forEach(function(col){
      if (Number(col).toString() === 'NaN')
        temp.push(col);
      else
        temp.push(Number(col));
    });
    return_data.push(temp);
  });
  return_data.pop(); //Remove empty last line
  if (dataToBeGenerate === 'test'){
    fsp.writeJsonFile('../data/sample_test_x.json', return_data);
    return null
  }else
    return readTruthTrain(return_data, '../data/truth_train.csv');
})
.then(function(data){
  if (data !== null){
    fsp.writeJsonFile('../data/sample_train_x_with_y.json', data);
    console.log(cli.cyan("sample_train_x_with_y.json") + ' is generated.' );
  }
})

function readTruthTrain (return_data,path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunck){
        var rows = chunck.toString().split('\n');
        return_data[0].push('y');
        for (var i = 1; i < return_data.length ; i++) {
          return_data[i].push(Number(rows[i-1].split(',')[1]));
        };
        for (var i = 0; i < return_data.length; i++) {
          if (return_data[i].length === 0)
            delete return_data[i];
        };
        resolve(return_data); // resolve => return data
      })
  })
}