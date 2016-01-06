var fsp = require('fs-time-prefix');

// var target = '../data/sample_train_x_with_course_stats.json';
var target = '../data/sample_test_x_with_course_stats.json';

fsp.readFile(target)
.then(function(chunk){
  var data = JSON.parse(chunk);

  var result = "";

  data.forEach(function(row){
    row.pop();
    result += row +"\n";
  });

  // fsp.writeFile('../data/sample_train_x_with_course_stats.csv',result);
  fsp.writeFile('../data/sample_test_x_with_course_stats.csv',result);

})
