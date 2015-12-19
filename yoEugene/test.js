var columns = ["id", "estimate"];
var csvWriter = require('csv-write-stream');
var fs = require('fs');


require("csv-to-array")({
    file: "./sampleSubmission.csv",
    columns: columns
}, function(err, array) {

	var writer = csvWriter();
    writer.pipe(fs.createWriteStream('out.csv'))
    

    for (var i = array.length - 1; i >= 0; i--) {
        array[i].estimate = Math.random();

    	writer.write(array[i]);

    };

    console.log(array);

    
    writer.end()

});
