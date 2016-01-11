var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var datatype = 'test';


var target = (datatype === 'train')
            ? '../data/enrollment_log_histogram_train.csv'
            : '../data/enrollment_log_histogram_test.csv';

var output = (datatype === 'train')
            ? '../data/weekly_train.csv'
            : '../data/weekly_test.csv';


// var dft = require('fft-js').dft,
//     signal = [0,0,0,0,0,0,0,0,0,14,16,0,7,10,0,0,0,0,0,22,10,0,0,0,0,23,0,0,0,0];

// var phasors = dft(signal);

// console.log(phasors);

// // var lib = require("ml-fft");
// // var FFT = lib.FFT;
// // var FFTUtils = lib.FFTUtils


// // var n = 16;
// // var nCols = n;
// // FFT.init(nCols);
// // var re = new Array(nCols);
// // var im = new Array(nCols);

// // for(var i=0;i<nCols;i++){
// //    re[i]=i;
// //    im[i]=nCols-i-1;
// // }

// // console.log(re, im);

// // var a = FFT.fft(re, im);
// // var b = FFT.ifft(re, im);

// // console.log(re);
// // console.log(im);


fsp.readFile(target)
.then(function(chunk){
  var data = chunk.toString().split('\r\n');
  var rows = [];
  data.forEach(function(row){
    rows.push(row.split(','));
  })
  for (var i = 0; i < rows.length; i++){
    for (var j = 0; j < rows[i].length; j++){
      rows[i][j] = Number(rows[i][j])
    }
  }
  return rows;
})
.then(function(rows){
  var result = [];
  var fw = fsp.createWriteStream(output)

  rows.shift(); // Remove title
  fw.write('Id,first_day,second_day,third_day,forth_day,fifth_day,sixth_day,seventh_day\n');

  rows.forEach(function(row,idx,arr){
    var first_id = 0;
    var temp = [];
    var id = row.shift();
    var done = false;
    for (var i = 0; i < row.length; i++) {
      if (row[i] !== 0 && done !== true){
        first_id = i
        done = true;
      }
    };

    if (first_id !== 0)
      row.splice(0,first_id);

    for (var i = 0; i < 7; i++) {
      temp[i] = 0;
    };

    for (var i = 0; i < row.length; i++) {
      var idx = i%7;
      temp[idx] += row[i];
    };

    var text = ''
    text += id;
    for (var i = 0; i < temp.length; i++) {
      text += ',' + temp[i]
    };
    text += '\n';
    // console.log(text);
    fw.write(text);
  })
})
