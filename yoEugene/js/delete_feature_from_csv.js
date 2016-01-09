var fs = require('fs');
var parse = require('csv-parse');
var json2csv = require('json2csv');

var output = [];
var fields = [];

var parser = parse({
    delimiter: ','
}, function(err, data) {

    // Edit delete feature list
    var delete_list = ["about_30",
        "about_40",
        "combinedopenended_30",
        "outlink_40",
        "peergrading_30",
        "peergrading_40",
        "static_tab_30",
        "static_tab_40"
    ]

    var delete_index = [];

    data[0].forEach(function(obj, indd) {
        if (delete_list.indexOf(obj) !== -1) {
            delete_index.push(indd);
        } else {
            fields.push(data[0][indd]);
        }
    })

    console.log(delete_index);
    console.log(fields);

    data.forEach(function(obj, index) {
        if (index === 0) return;
        output.push({});
        for (var i = 0; i < data[0].length; i++) {
            if (delete_index.indexOf(i) === -1) {
                output[index-1][data[0][i]] = data[index][i]*1;
            }
        }
        console.log(Math.round((index / data.length)*100) + '%');
    })

    console.log('Start to write csv...');
    console.log('---------------------');

    json2csv({
        data: output,
        fields: fields
    }, function(err, csv) {
        if (err) console.log(err);
        // Edit write file name below ==================================
        fs.writeFile('../sample_train_20160109.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
    });
});

// Edit read file name below ==================================
fs.createReadStream('../sample_train_20160106.csv').pipe(parser);
