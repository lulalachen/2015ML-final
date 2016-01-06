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

  // Process titles
  var titles = Object.keys(stats[1].stats);
  var tempY;
  if (dataToBeGenerate === 'train')
    tempY = enrollments[0].pop(); // Put "y" in the back
  enrollments[0].shift(); // Remove Id column
  enrollments[0].shift(); // Remove username column
  enrollments[0].shift(); // Remove courseId column
  titles.forEach(function(val){
    enrollments[0].push(val)
  })
  enrollments[0].push(tempY);

  // Ignore title line
  for (var i = 1; i < enrollments.length; i++) {
    var ans = _.findWhere(stats, {id : enrollments[i][2]});
    if (ans !== undefined){
      var tempY;
      if (dataToBeGenerate === 'train')
        tempY = Number(enrollments[i].pop());
      var items = Object.keys(ans.stats);
      items.forEach(function(val){
        enrollments[i].push(ans.stats[val]);
      })
      enrollments[i].shift(); // Remove Id column
      enrollments[i].shift(); // Remove username column
      enrollments[i].shift(); // Remove courseId column
      if (dataToBeGenerate === 'train')
        enrollments[i].push(tempY);
    } else {
        console.log('GG ler~~~' + i);
    }
  };

  // if (dataToBeGenerate === 'train'){
  //   fsp.writeJsonFile('../data/enrollment_train_with_course_stats(y).json', enrollments);
  //   console.log(cli.cyan('enrollment_train_with_course_stats(y).json') + ' is generated.');
  // }
  // else if (dataToBeGenerate === 'test'){
  //   fsp.writeJsonFile('../data/enrollment_test_with_course_stats.json', enrollments)
  //   console.log(cli.cyan('enrollment_test_with_course_stats.json') + ' is generated.');
  // }
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