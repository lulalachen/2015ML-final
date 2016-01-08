var fsp = require('fs-time-prefix'),
    ml = require('machine_learning'),
    stats = require("stats-lite"),
    Promise = require('bluebird'),
    util = require('util');

var target = ('train' === 'test')
            ? ['../data/enrollTime_train.csv','../data/enrollment_train.csv', './results/course.json', '../data/sample_train_adjusted_course_stats.csv']
            : ['../data/enrollTime_test.csv','../data/enrollment_test.csv', './results/course.json', '../data/sample_test_adjusted_course_stats.csv'];

fsp.readFile(target[0])
.then(function(chunk){
  return toJson(chunk);
})
.then(function(data){
  return readAnother(data, target[1]);
})
.spread(function(enrollment_time, enrollment_basics){
  var tempEnroll = [];
  enrollment_basics.forEach(function(enroll, idx, arr){
    enroll = enroll.concat(enrollment_time[idx].pop());
    tempEnroll.push(enroll);
  })
  return readAnotherJson(tempEnroll, target[2]);
})
.spread(function(enrollments, courses){
  var newEnroll = [];
  enrollments.forEach(function(enroll, idx, arr){
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].courseIdRaw === enroll[2]){
        var start = (new Date(enroll.time)).getTime();
        var period = [start, start + 86400 * 1000 * 30, start + 86400 * 1000 * 40];
        var stats = calculateStats(courses[i], period);
        newEnroll.push({
          id : enroll[0],
          stats : stats
        });
        break;
      }
    };
  });
  return newEnroll;
})
.then(function(data){
  var file = fsp.createWriteStream(target[3]);
  var title = 'Id';
  for (var i = 0; i < Object.keys(data[0].stats).length; i++) {
    title += ',' + Object.keys(data[0].stats)[i];
  }
  title += '\n';
  file.write(title);
  data.forEach(function(row){
    var text = '';
    text += row.id;

    for (var i = 0; i < Object.keys(row.stats).length; i++) {
      text += ',' + row.stats[Object.keys(row.stats)[i]]
    };
    text += '\n';
    file.write(text);
  });

})


function readAnotherJson(enroll, path){
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      return JSON.parse(chunk).courses;
    })
    .then(function(data){
      resolve([enroll, data]);
    })
  })
}


function readAnother(time, path){
  return new Promise(function(resolve, reject){
    fsp.readFile(path)
    .then(function(chunk){
      return toJson(chunk);
    })
    .then(function(data){
      resolve([time, data]);
    })
  })
}

function toJson(chunk){
  return new Promise(function(resolve, reject){
    var tempRows = chunk.toString().split('\n');
    var rows = [];
    tempRows.forEach(function(each){
      rows.push(each.split(','));
    })
    resolve(rows);
  })
}


function calculateStats (course, period) {
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
  var counts = [];
  var temp = {};
  var category = [];
  var coursePeriod = [];
  var timePeriod = [86400 * 30 * 1000, 86400 * 40 * 1000];

  for (var i = 0; i < fields.length; i++) {
    temp[fields[i]+'_30'] = 0;
    temp[fields[i]+'_40'] = 0;
  };
  for (var i = 0; i < course.modules.length; i++) {
    if (course.modules[i].category === 'course'){
      var tempStart = (new Date(course.modules[i].courseStart)).getTime()
      coursePeriod.push(tempStart);
      coursePeriod.push(tempStart + timePeriod[0]);
      coursePeriod.push(tempStart + timePeriod[1]);
      break;
    }
  };

  // console.log(coursePeriod);

  for (var i = 0; i < course.modules.length; i++) {
      if (temp[course.modules[i].category+'_30'] !== undefined || temp[course.modules[i].category+'_40'] !== undefined){
        // Filter by target fields
        switch (inWhichPeriod(course.modules[i].courseStart, coursePeriod)) {
          case 'first':
            temp[course.modules[i].category + '_30'] ++;
            break;
          case 'second':
            temp[course.modules[i].category + '_40'] ++;
            break;
          default :
            break;
        }
      }
  };
  // counts.push({
  //   id : course.courseIdRaw,
  //   stats : temp
  // });
  // console.log(temp);
  return temp;
}


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

