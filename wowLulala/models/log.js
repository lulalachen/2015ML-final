var _ = require('underscore');
var fsp = require('fs-time-prefix');
var wf = fsp.createWriteStream('./results/logs.csv');
var stats = require("stats-lite");

var LogList = function(){
  this.ids = [];
  this.logs = [];
  var text = 'Id,mean,median,variance,timeSpent\n';
  console.log(Object.keys(wf));
  wf.write(text);
}

LogList.prototype.newLog = function(log) {
  this.ids.push(log.enrollment_id);
  this.logs.push(log);
};

LogList.prototype.releaseMemory = function() {
  var text = '';
  var id = this.ids.pop();
  var log = this.logs.pop();
  if (id%1000 ===0)
    console.log(id);
  text += id + ',';
  text += JSON.stringify(getStats(log.timeGapByHour())['mean']);
  text += ',';
  text += JSON.stringify(getStats(log.timeGapByHour())['median']);
  text += ',';
  text += JSON.stringify(getStats(log.timeGapByHour())['variance']);
  text += ',';
  text += log.totalTimeSpendByHour().toString();
  text += '\n';
  wf.write(text);
};


//////////////////////////

var Logs = function(row){
  this.enrollment_id  = row[0];
  this.log = [];
  this.log.push({
    time   : row[1],
    source : row[2],
    event  : row[3],
    object : row[4]
  });
}

Logs.prototype.addLog = function(row) {
  this.log.push({
    time   : row[1],
    source : row[2],
    event  : row[3],
    object : row[4]
  });
};

Logs.prototype.timeDistribution = function() {
  var gap = 0;
  var distribution = [0];
  for (var i = 1; i < this.log.length; i++) {
    gap += new Date(this.log[i].time) - new Date(this.log[i-1].time);
    distribution.push(gap/(1000*60*60*24));
  };
  return distribution;
};

Logs.prototype.timeGapByDays = function() {
  var gap = 0;
  var distribution = [0];
  for (var i = 1; i < this.log.length; i++) {
    gap = new Date(this.log[i].time) - new Date(this.log[i-1].time);
    distribution.push(gap/(1000*60*60*24));
  };
  distribution = _.reject(distribution,function(num){return num <= 1});
  return distribution;
};

Logs.prototype.timeGapByHour = function() {
  var gap = 0;
  var distribution = [0];
  for (var i = 1; i < this.log.length; i++) {
    gap = new Date(this.log[i].time) - new Date(this.log[i-1].time);
    distribution.push(gap/(1000*60*60));
  };
  distribution = _.reject(distribution,function(num){return num <= 1});
  return distribution;
};

Logs.prototype.totalTimeSpendByHour = function() {
  var l = this.log.length;
  return (new Date(this.log[l-1].time) - new Date(this.log[0].time))/(1000*60*60);
};

var list = new LogList();

function checkExistence (row){
  var eId = row[0];
  if (eId === undefined || eId.length === 0)
    return console.log('Please provide enrollment_id.');
  else {
    var exist = (_.find(list.ids,function(id){return id === eId}) === undefined) ? false : true;
    if (exist){
      var object = _.findWhere(list.logs, {enrollment_id : eId});
      object.addLog(row);
    } else if (!exist && list.ids.length!== 0){
      list.releaseMemory();

      var newLog = new Logs(row);
      list.newLog(newLog);
    } else {
      var newLog = new Logs(row);
      list.newLog(newLog);
    }
  }
}
function getStats(data){
  // Calculate basic column stats //
  var statistics = function (input){
    this.sum = stats.sum(input);
    this.mean = stats.mean(input);
    this.median = stats.median(input);
    this.variance = stats.variance(input);
    this.standard_deviation = stats.stdev(input);
    this.percentileOfEightyFive = stats.percentile(input,0.7);
  };
  return (data.length !== 0) ? new statistics(data) : new statistics([0]);
}
function printObject (){
  return list;
}

// var data  = ['1','2014-06-14T09:44:29','browser','page_close','3T6XwoiMKgol57cm29Rjy8FXVFcIomxl']
// var data2 = ['1','2014-06-19T06:21:04','server','nagivate','Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b']
// var data3 = ['1','2014-06-23T06:21:11','server','nagivate','Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b']

// checkExistence(data)
// checkExistence(data2)
// checkExistence(data3)
// var obj = printObject();
// list.logs[0].timeGap()


module.exports.input = checkExistence;
module.exports.display = printObject;