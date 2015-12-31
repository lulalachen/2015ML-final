var fsp = require('fs-time-prefix');

var track = process.env.TRACK || 'one';
var outputFile = process.env.


fsp.readFile('./results/knn.json')
.then(function(chunk){
  var data = JSON.parse(chunk);
  fsp.readFile('../data/sample_test_x.json')
  .then(function(test){
    var original = JSON.parse(test);
    original.shift();
    var result = '';
    console.log(original.length, data.length);
    if (track === 'one') {
      for (var i = 0; i < original.length; i++) {
        result += original[i][0] + ' ' + data[i] +'\n';
      };
    } else {
      for (var i = 0; i < original.length; i++) {
        if (data[i]===null)
          result += original[i][0] + ',' + '1' +'\n';
        else if (data[i]>=0.1126)
          result += original[i][0] + ',' + '1' +'\n';
        else
          result += original[i][0] + ',' + '0' +'\n';
      };
    }
    fsp.writeFile('./results/'+ outputFile + '.csv',result)
  })
})