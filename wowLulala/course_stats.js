var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

fsp.readFile('./results/course.json')
.then(function(chunk){
  return JSON.parse(chunk);
})
.then(function(data){
  var courses = data.courses;
  var counts = [];
  var fields = [
                'about',
                'chapter',
                'combinedopenended',
                // 'course',
                // 'course_info',
                'discussion',
                'html',
                'outlink',
                'peergrading',
                'problem',
                'sequential',
                'static_tab',
                'vertical',
                'video'
                // 'dictation'
              ];

  courses.forEach(function(each, idx, arr){
    var temp = {};
    var category = [];
    var coursePeriod = [];
    var timePeriod = [86400 * 30 * 1000, 86400 * 40 * 1000];

    for (var i = 0; i < fields.length; i++) {
      temp[fields[i]+'_30'] = 0;
      temp[fields[i]+'_40'] = 0;
    };
    for (var i = 0; i < each.modules.length; i++) {
      if (each.modules[i].category === 'course'){
        var tempStart = (new Date(each.modules[i].courseStart)).getTime()
        coursePeriod.push(tempStart);
        coursePeriod.push(tempStart + timePeriod[0]);
        coursePeriod.push(tempStart + timePeriod[1]);
        break;
      }
    };

    // console.log(coursePeriod);

    for (var i = 0; i < each.modules.length; i++) {
        if (temp[each.modules[i].category+'_30'] !== undefined || temp[each.modules[i].category+'_40'] !== undefined){
          // Filter by target fields
          switch (inWhichPeriod(each.modules[i].courseStart, coursePeriod)) {
            case 'first':
              temp[each.modules[i].category + '_30'] ++;
              break;
            case 'second':
              temp[each.modules[i].category + '_40'] ++;
              break;
            default :
              break;
          }
        }
    };
    counts.push({
      id : each.courseIdRaw,
      stats : temp
    });
  })

  console.log(counts[0]);
  fsp.writeJsonFile('./results/course_stats_filter.json',counts);

  return counts;
})
.then(function(data){
  var target = ('train' === 'train')
              ? ['../sample_train_x.csv', '../sample_train_x_with_filter_course_stat.csv']
              : ['../sample_test_x.csv', '../sample_test_x_with_filter_course_stat.csv'];
  var file = fsp.createWriteStream(target);


})

function inWhichPeriod(time, period){
  var time = (time !== 'null') ? (new Date(time)).getTime() : (new Date(0)).getTime();
  var seg = [time - period[0],period[1] - time]
  // console.log(seg);
  if ((time - period[0]) >= 0 && (period[1] - time) >= 0) {
    return 'first';
  } else if ((time - period[1]) >= 0 && (period[2] - time) >= 0 ){
    return 'second';
  } else {
    return 'none';
  }
}


function stats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentileOfEightyFive = stats.percentile(input,0.85);
  };

  for (var i = 0; i < data.length; i++) {
    data[i].stats = new statistics(data[i].dataset);
    delete data[i].dataset;
  };
  console.log('Finish calculating stats.');
  return data;
}

function readTruthTrain (return_data, path){
  return new Promise (function(resolve, reject){
      fsp.readFile(path)
      .then(function(chunk){
        var rows = chunk.toString().split('\n');
        return_data[0].push('y');
        for (var i = 1; i < return_data.length - 1 ; i++) {
          return_data[i].push(rows[i-1].split(',')[1]);
        };
        resolve(return_data); // resolve => return data
      })
  })
}