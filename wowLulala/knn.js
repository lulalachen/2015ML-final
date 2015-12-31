var ml = require('machine_learning');
var fsp = require('fs-time-prefix');
var Promise = require('bluebird');
var stats = require("stats-lite");


fsp.readFile('../data/sample_train_x_with_course_stats.json')
.then(function(chunk){
  var data = JSON.parse(chunk);
  data.shift(); // Remove title
  var y = [];
  data.forEach(function(val){
    y.push([val.pop()]);
  });
  return [data, y];
})
// .spread(function(data, y){
//   // ...........Normalize........... //

//   // Convert into column-based dataset //
//   var normalizedData = [];
//   for (var i = 0; i < data[0].length; i++) {
//     normalizedData[i] = [];
//   };

//   data.forEach(function(row){
//     for (var i = 0; i < row.length; i++) {
//       // console.log(i);
//       normalizedData[i].push(row[i]);
//     };
//   });
//   normalizedData.forEach(function(col, col_id, arr_col){
//     var mean      = stats.mean(col);
//     var variance  = stats.stdev(col);
//     col.forEach(function(each, idx, arr){
//       if (variance !== 0){
//         // course = 1 ; course_info = 2 //
//         arr[idx]-=mean;
//         arr[idx]/=variance;
//       } else {
//         arr[idx] = 0;
//       }
//     });
//   });
//   return [normalizedData, y];
// })
// .spread(function(normalizedData, y){
//   var rowBasedData = [];
//   for (var i = 0; i < normalizedData[0].length; i++) {
//     rowBasedData[i] = [];
//   };
//   normalizedData.forEach(function(col, idx, arr){
//     // console.log(idx +' ' + col.length);
//     for (var i = 0; i < col.length; i++) {
//       rowBasedData[i].push(col[i]);
//     };
//   });
//   return [rowBasedData, y];
// })
.spread(function(x,y){
  var knn = new ml.KNN({
      data : x,
      result : y
  });
  // var svm = new ml.SVM({
  //     x : x,
  //     y : y
  // });

  // svm.train({
  //     C : 1.0, // default : 1.0. C in SVM.
  //     tol : 1e-4, // default : 1e-4. Higher tolerance --> Higher precision
  //     max_passes : 20, // default : 20. Higher max_passes --> Higher precision
  //     alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision

  //     kernel : {type:"linear"}
  //     // default : {type : "gaussian", sigma : 1.0}
  //     // {type : "gaussian", sigma : 0.5}
  //     // {type : "linear"} // x*y
  //     // {type : "polynomial", c : 1, d : 8} // (x*y + c)^d
  //     // Or you can use your own kernel.
  //     // kernel : function(vecx,vecy) { return dot(vecx,vecy);}
  // });
  // var classifier = new ml.LogisticRegression({
  //     'input' : x,
  //     'label' : y,
  //     'n_in' : 30,
  //     'n_out' : 1
  // });

  // classifier.set('log level',2);

  // var training_epochs = 200, lr = 0.6;
  // console.time('start_training');
  // classifier.train({
  //     'lr' : lr,
  //     'epochs' : training_epochs
  // });
  // console.timeEnd('start_training');

  // console.log(Function.keys(classifier));
  console.log(Object.keys(knn));
  fsp.writeJsonFile('./results/classifierKNN.js', knn);
  return readAnother(knn,'../data/sample_test_x_with_course_stats.json');
})
.spread(function(classifier, test_data){
  // var result = classifier.predict(test_data);
  var knn_result = [];
  test_data.forEach(function(row, idx, arr){
    var prediction = classifier.predict({
      x : row,
      k : 3,
      // weightf : {type : 'gaussian', sigma : 10.0},
      distance : {type : 'euclidean'}
    });
    if (idx % 1000 === 0)
      console.log('Meow ' + idx);
    knn_result.push(prediction);
  })
  // fsp.writeJsonFile('./results/svm.json', result);
  fsp.writeJsonFile('./results/knn.json', knn_result);
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








