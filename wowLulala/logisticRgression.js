var ml = require('machine_learning');
var fsp = require('fs-time-prefix');
var Promise = require('bluebird');
var stats = require("stats-lite");


fsp.readFile('../data/enrollment_train_with_course_stats\(y\).json')
.then(function(chunk){
  var data = JSON.parse(chunk);
  data.shift(); // Remove title
  // data.pop(); // Remove bottom empty array
  var y = [];
  var a=0,b = 0;
  data.forEach(function(val){
    y.push(val.pop());
  });
  return [data, y];
})
.then(function (chunk) {
  // Conver to numbers....................
  var x = chunk[0];
  var y = chunk[1];
  for (var i = 0; i < x.length; i++){
    for (var j = 0; j < x[i].length; j++){
      x[i][j] = Number(x[i][j]);
    }
    y[i] = [Number(y[i])];
  }
  // console.log('herer');
  return [x,y];
})
.spread(function(data, y){
  // ...........Normalize........... //

  // Convert into column-based dataset //
  var normalizedData = [];
  for (var i = 0; i < data[0].length; i++) {
    normalizedData[i] = [];
  };

  data.forEach(function(row){
    for (var i = 0; i < row.length; i++) {
      // console.log(i);
      normalizedData[i].push(row[i]);
    };
  });
  normalizedData.forEach(function(col, col_id, arr_col){
    var mean      = stats.mean(col);
    var variance  = stats.stdev(col);
    col.forEach(function(each, idx, arr){
      if (variance !== 0){
        // course = 1 ; course_info = 2 //
        arr[idx]-=mean;
        arr[idx]/=variance;
      } else {
        arr[idx] = 0;
      }
    });
  });
  return [normalizedData, y];
})
.spread(function(normalizedData, y){
  var rowBasedData = [];
  for (var i = 0; i < normalizedData[0].length; i++) {
    rowBasedData[i] = [];
  };
  normalizedData.forEach(function(col, idx, arr){
    // console.log(idx +' ' + col.length);
    for (var i = 0; i < col.length; i++) {
      rowBasedData[i].push(col[i]);
    };
  });
  return [rowBasedData, y];
})
.spread(function(x,y){

  var classifier = new ml.LogisticRegression({
      'input' : x,
      'label' : y,
      'n_in' : 15,
      'n_out' : 1
  });

  classifier.set('log level',2);

  var training_epochs = 800, lr = 0.01;
  console.time('start_training');
  classifier.train({
      'lr' : lr,
      'epochs' : training_epochs
  });
  console.timeEnd('start_training');

  console.log("Entropy : "+classifier.getReconstructionCrossEntropy());
  fsp.writeFile('../results/classifier.js', classifier.toString());
  return readAnother(classifier,'./data/enrollment_test_with_course_stats.json');
})
.then(function(chunk){
  var classifier = chunk[0];
  var test_data = chunk[1];
  var result = classifier.predict(test_data);
  fsp.writeJsonFile('./results/logisticRegression.json', result);
  console.log('FUCKINNNNNG DONE!!!!');
})
.catch(function (err) {
  console.log(err);
})


function readAnother (classifier, path) {
  return new Promise (function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var data = JSON.parse(chunk);
      data.shift(); // Remove title
      resolve([classifier, data]);
    })
  })
}








