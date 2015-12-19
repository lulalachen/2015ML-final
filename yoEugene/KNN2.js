var ml = require('machine_learning');
var csvWriter = require('csv-write-stream');
var fs = require('fs');



var columns = ["ID", "user_log_num", "course_log_num", "take_course_num", "take_user_num", "log_num", "server_nagivate", "server_access", "server_problem", "browser_access", "browser_problem", "browser_page_close", "browser_video", "server_discussion", "server_wiki", "chapter_count", "sequential_count", "video_count"];

var csvWriter = require('csv-write-stream');
var fs = require('fs');


require("csv-to-array")({
    file: "../data/sample_train_x.csv",
    columns: columns
}, function(err, array) {

    // var writer = csvWriter();
    // writer.pipe(fs.createWriteStream('out.csv'))
    var train = [];

    for (var i = array.length - 1; i >= 0; i--) {
        // array[i].estimate = Math.random();
        var count = 0;
        train[i] = [];
        for (key in array[i]) {
            train[i][count] = array[i][key] * 1;
            count++;
        }

        // writer.write(array[i]);

    };

    train.shift();

    console.log(train.length);



    var columns = ["id", "dropout"];

    require("csv-to-array")({
        file: "../data/truth_train.csv",
        columns: columns
    }, function(err, array) {

        var result = [];

        for (var i = array.length - 1; i >= 0; i--) {
            // array[i].estimate = Math.random();
            for (key in array[i]) {
                if (key !== 'id') {
                    result[i] = array[i][key] * 1;
                }
            }

            // writer.write(array[i]);

        };

        // result.shift();

        console.log(result.length);



        // writer.end()


        var knn = new ml.KNN({
            data: train,
            result: result
        });



        var columns = ["ID", "user_log_num", "course_log_num", "take_course_num", "take_user_num", "log_num", "server_nagivate", "server_access", "server_problem", "browser_access", "browser_problem", "browser_page_close", "browser_video", "server_discussion", "server_wiki", "chapter_count", "sequential_count", "video_count"];

        require("csv-to-array")({
            file: "../data/sample_test_x.csv",
            columns: columns
        }, function(err, array) {

            var predict = [],
                predict_result = [],
                output_string = [];


            for (var i = 6028; i < 12055; i++) {
                // array[i].estimate = Math.random();
                var count = 0;
                predict[i] = [];
                for (key in array[i]) {
                    if (key !== 'id') {
                        predict[i][count] = array[i][key] * 1;
                        count++;
                    }
                }


                predict_result[i - 1] = KNN_predict(predict[i]);

                output_string.push([predict[i][0], predict_result[i - 1]]);

                if (i % 1000 === 0)
                    console.log(i + ' Meow!');

            }

            for (var j = 0; j < output_string.length; j++) {
                var estimate = output_string[j][1] < 0.0001 ? 0 : output_string[j][1];
                if (JSON.stringify(output_string[j][1]) == 'null')
                    estimate = 1;
                fs.appendFile('out2.csv', JSON.stringify(output_string[j][0]) + ',' + JSON.stringify(estimate) + '\n', function() {});
            }

            console.log(predict.length);

            console.log(predict_result);

            console.log(predict_result.length);



        });

        function KNN_predict(test_data) {
            var y = knn.predict({
                x: test_data,
                k: 3,

                weightf: {
                    type: 'gaussian',
                    sigma: 10.0
                },
                // default : {type : 'gaussian', sigma : 10.0}
                // {type : 'none'}. weight == 1
                // Or you can use your own weight f
                // weightf : function(distance) {return 1./distance}

                distance: {
                    type: 'euclidean'
                }
                // default : {type : 'euclidean'}
                // {type : 'pearson'}
                // Or you can use your own distance function
                // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
            });

            return y;
        }

    });
});
