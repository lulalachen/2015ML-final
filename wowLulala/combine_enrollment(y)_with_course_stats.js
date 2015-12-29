var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    _ = require('underscore'),
    cli = require('cli-color'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var dataToBeGenerate = process.env.DATATYPE || 'train';

fsp.readFile('./results/course_stats.json')
.then(function(data){
  var data = JSON.parse(data);
  var trains = [];
  if (dataToBeGenerate === 'train')
    return readAnother(data, '../data/enrollment_train_with_y.json');
  else if (dataToBeGenerate === 'test')
    return readAnother(data, '../data/enrollment_test.json');
  else
    console.log('Error input type');
})
.then(function(chunk){
  return [chunk[0],chunk[1]];
}).spread(function(stats, enrollments){

  var titles = Object.keys(stats[0].stats);
  titles.forEach(function(val){
    enrollments[0].push(val)
  })
  for (var i = 1; i < enrollments.length; i++) {
    var ans = _.findWhere(stats, {id : enrollments[i][2]});
    if (ans !== undefined){
      if (dataToBeGenerate === 'train')
        var tempY = enrollments[i].pop();

      var items = Object.keys(ans.stats);
      items.forEach(function(val){
        enrollments[i].push(ans.stats[val].toString());
      })

      if (dataToBeGenerate === 'train')
        enrollments[i].push(tempY);
    }
  };

  if (dataToBeGenerate === 'train'){
    fsp.writeJsonFile('../data/enrollments_train_with_course_stats(y).json', enrollments);
    console.log(cli.cyan('enrollments_train_with_course_stats(y).json') + ' is generated.');
  }
  else if (dataToBeGenerate === 'test'){
    fsp.writeJsonFile('../data/enrollment_test_with_course_stats.json', enrollments)
    console.log(cli.cyan('enrollment_test_with_course_stats.json') + ' is generated.');
  }
})


function readAnother(return_data, path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunck){
        var rows = JSON.parse(chunck.toString());
        resolve([return_data, rows]); // resolve => return data
      })
  })
}