var ml = require('machine_learning');
var fsp = require('fs-time-prefix');
var Promise = require('bluebird');


fsp.readFile('../data/enrollment_train_with_course_stats\(y\).json')
.then(function(chunk){
  var data = JSON.parse(chunk);
  data.shift(); // Remove title
  data.pop(); // Remove bottom empty array
  var y = [];
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
    for (var j = 0; i < x[i].length; j++){
      x[i][j] = Number(x[i][j]);
    }
    y[i] = Number(y[i]);
  }
  console.log('herer');
  return [x,y];
})
.then(function(chunk){
  var x = chunk[0];
  var y = chunk[1];
  console.log(x[0].length);
  console.log(y[0]);

  var classifier = new ml.LogisticRegression({
      'input' : x,
      'label' : y,
      'n_in' : 13,
      'n_out' : 1
  });

  classifier.set('log level',2);

  var training_epochs = 800, lr = 0.6;
  classifier.train({
      'lr' : lr,
      'epochs' : training_epochs
  });
  console.log("Entropy : "+classifier.getReconstructionCrossEntropy());

  return readAnother(classifier,'../data/enrollment_test_with_course_stats.json');
})
.then(function(chunk){
  var classifier = chunk[0];
  var test_data = chunk[1];
  console.log(test_data[1]);
})
.catch(function (err) {
  console.log(err);
})


function readAnother (classifier, path) {
  return new Promise (function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var data = JSON.parse(chunk);
      resolve([classifier, data]);
    })
  })
}








