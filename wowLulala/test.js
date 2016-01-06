var fsp = require('fs-time-prefix');
var Promise = require('bluebird');
var stats = require("stats-lite");
var ml = require('machine_learning');


fsp.readFile('../data/enrollment_train_with_y.json')
.then(function(chunk){
  var data = JSON.parse(chunk);
  var targetCourse = 'AXUJZGmZ0xaYSWazu8RQ1G5c76ECT1Kd';
  var pass = 0,
      fail = 0;
  var list = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][2] === targetCourse){
      if (data[i][3] === '1')
        fail++;
      else if (data[i][3] === '0'){
        // list.push(data[i][0]);
        pass++;
      }
      list.push(data[i][0]);
    }
  };
  console.log(pass, fail, pass/(pass+fail));
  return readAnother(list, '../data/sample_train_x_with_y.json');
})
.spread(function(data, list){

  var x = [],
      y = [];
  data.shift();
  for (var i = 0; i < data.length; i++) {
    y.push([data[i].pop()]);
    x.push(data[i]);
  };
  var knn = new ml.KNN({
    data : x,
    result : y
  });
  return predict(knn, '../data/sample_test_x.json');
})
// .spread(function(data, list){
//   // logistic
//   var x = [],
//       y = [];
//   data.shift();
//   for (var i = 0; i < data.length; i++) {
//     y.push([data[i].pop()]);
//     x.push(data[i]);
//   };
//   var classifier = new ml.LogisticRegression({
//       'input' : x,
//       'label' : y,
//       'n_in' : data[0].length,
//       'n_out' : 1
//   });

//   classifier.train({
//       'lr' : 0.6,
//       'epochs' : 2000
//   });

//   return predict(classifier, '../data/sample_test_x.json');
// })
// .spread(function(data, list){
// // SVM
//   var x = [],
//       y = [];

//   data.shift();
//   for (var i = 0; i < data.length; i++) {
//     y.push(data[i].pop());
//     x.push(data[i]);
//   };
//   // console.log(x);
//   // console.log(y);
//   console.log('Start SVM');
//   console.time('svm');
//   console.time('svm-train');
//   var svm = new ml.SVM({
//       x : x,
//       y : y
//   });

//   svm.train({
//     C : 1.5, // default : 1.0. C in SVM.
//     tol : 1e-3, // default : 1e-4. Higher tolerance --> Higher precision
//     max_passes : 25, // default : 20. Higher max_passes --> Higher precision
//     alpha_tol : 1e-3, // default : 1e-5. Higher alpha_tolerance --> Higher precision
//     kernel : {type : "gaussian", sigma : 1.0} // this is default.kernel : {type : ""} // x*y
//   });
//   console.timeEnd('svm-train');
//   return predict(svm, '../data/sample_test_x.json');
// })
.then(function(predicts){
  // Display results
  console.log(predicts);
  // console.timeEnd('svm');
  fsp.writeJsonFile('./results/KNN_id_six.json', predicts);
})
// .spread(function(data, list){
//   var col = [];
//   for (var i = 0; i < data[0].length; i++) {
//     col[i] = [];
//   };
//   for (var i = 1; i < data.length; i++){
//     for (var j = 0; j < data[i].length; j++){
//       col[j].push(data[i][j]);
//     }
//   }
//   var stats = [];
//   for (var i = 0; i < col.length; i++) {
//     stats.push({
//       column : data[0][i],
//       stats : getStats(col[i])
//     });
//   };
//   console.log(stats);
// })
function predict (classifier, path) {
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var data = JSON.parse(chunk);
      data.shift();
      var predicts = [];
      data.forEach(function(each, idx, arr){
        // predicts.push(classifier.predict(each));
        if (idx % 1000 === 0)
          console.log('Meow ' + idx);
        predicts.push(classifier.predict({
          x : each,
          k : 3,
          weightf : {type : 'gaussian', sigma : 10.0},
          distance : {type : 'euclidean'}
        }));
      })
      // predicts = classifier.predict(data);

      resolve(predicts);
    })
  })
}

function readAnother (list, path){
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      var rows = JSON.parse(chunk);
      var data = [];
      data.push(rows[0])
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < rows.length; j++) {
          if (Number(rows[j][0]) === Number(list[i])){
            data.push(rows[j]);
            break;
          }
        };
      };
      // console.log(data[1]);
      resolve([data, list]);
    })
  })
}

function getStats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentile = stats.percentile(input,0.2);
  };
  return (data.length !== 0) ? new statistics(data) : new statistics([0]);
}


function normalize (data) {
  var variance  = stats.variance(data);
  var mean      = stats.mean(data);
  data.forEach(function(val){
    if (variance !== 0){
      val -= mean;
      val /= variance;
    };
  });
}
