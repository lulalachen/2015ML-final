var fs = require('fs');
var parse = require('csv-parse');
var json2csv = require('json2csv');


var id_list = [];


/////////////////////// EDIT HERE /////////////////////////
var filePathList = [
    '../../heyDerek/Libs/GradientBoosting/result/1-1.csv',
    '../../heyDerek/Libs/GradientBoosting/result/1-2.csv',
    '../../heyDerek/Libs/GradientBoosting/result/1-3.csv',
    '../../heyDerek/Libs/GradientBoosting/result/1-4.csv',
    '../../heyDerek/Libs/GradientBoosting/result/1-5.csv',
    '../../heyDerek/Libs/GradientBoosting/result/1-6.csv'
];

var fileNumber = filePathList.length;

readCSVandAverage(filePathList, [], id_list, 'track2');

///////////////////////////////////////////////////////////


function readCSVandAverage(filePathList, result, id_list, track) {


    if (filePathList.length > 0) {
        var parser = parse({
            delimiter: ','
        }, function(err, data) {

            data.forEach(function(obj, index) {
                if (result[index] === undefined) result[index] = 0;
                result[index] += obj[1] * 1;
                id_list[index] = obj[0];
            })

            readCSVandAverage(filePathList, result, id_list, track);
        });

        var path = filePathList.shift();

        fs.createReadStream(path).pipe(parser);

    } else {

    	var fields = ["enrollment_id", "result"];

    	var csv = [];

    	result.forEach(function(obj, index){
    		csv.push({});
    		csv[index].enrollment_id = id_list[index];
    		csv[index].result = (track === 'track1') ? obj/fileNumber : Math.round(obj/fileNumber);
    	})

        json2csv({
            data: csv,
            fields: fields
        }, function(err, csv) {
            if (err) console.log(err);
//////////////////////////////////// EDIT HERE /////////////////////////
            fs.writeFile('../../allResults/average_for_'+track+'.csv', csv, function(err) {
////////////////////////////////////////////////////////////////////////
                if (err) throw err;
                console.log('file saved');
            });
        });
    }
}