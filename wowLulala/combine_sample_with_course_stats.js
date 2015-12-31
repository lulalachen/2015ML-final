var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util'),
    cli = require('cli-color');

var dataToBeGenerate = process.env.DATATYPE || 'train';
var target;
if (dataToBeGenerate === 'train'){
  target = ['../data/enrollment_train_with_course_stats\(y\).json', '../data/sample_train_x_with_y.json'];
} else {
  target = ['../data/enrollment_test_with_course_stats.json', '../data/sample_test_x.json'];
}

var title = [];
fsp.readFile(target[0])
.then(function(chunk){
  var data = JSON.parse(chunk);

  title = title.concat(data.shift()); // Remove title
  title.pop(); // Remove "y"
  var y = [];
  data.forEach(function(val){
    y.push([val.pop()]);
  });
  return [data, y];
})
.spread(function(enrollment_data, y){
  return readSample(enrollment_data, y, target[1]);
})
.spread(function(data,y){

  data.unshift(title); // Put title back in line
  if (dataToBeGenerate === 'train')
    fsp.writeJsonFile('../data/sample_train_x_with_course_stats.json', data);
  else
    fsp.writeJsonFile('../data/sample_test_x_with_course_stats.json', data);

})


function readSample (enrollment_data, y, path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunk){
        var rows = JSON.parse(chunk);
        title = title.concat(rows.shift()); // Remove title
        for (var i = 0; i < rows.length; i++) {
          if (dataToBeGenerate === 'train')
            rows[i].pop(); // Remove 'y'
          rows[i] = rows[i].concat(enrollment_data[i]).concat(y[i]);
          rows[i].shift(); // Remove Id
          rows[i].shift(); // Remove username
          rows[i].shift(); // Remove courseId
        };
        resolve([rows, y]); // resolve => return data
      })
  })
}