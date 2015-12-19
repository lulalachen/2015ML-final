var fsp = require('fs-time-prefix');

var data = {
  name : 'lulala',
  birthday : '1993/02/06'
};

// fsp.writeJsonFile('./test123.json',data);
// fsp.writeTimePrefix('./test123.json',data);

var A = '2014-06-14T09:38:29';
var B = '2014-06-14T09:45:29';



var data = ["32,2014-06-22T23:22:03,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-22T23:22:07,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:22:07,server,access,Zqtcad1eZCX5EPHz3Nzkc1ILYPoLk1s6",
"32,2014-06-22T23:22:12,server,access,AID4xxV79viIHIAExKx5brZ9PQa1fjlZ",
"32,2014-06-22T23:22:13,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:22:46,server,access,PSjYLli3GRFSCsvRX8SbKhC6uC0uxoiM",
"32,2014-06-22T23:22:47,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:23:06,server,access,1y5K5Inw0Z77xJhcRNxp69iTArwtwytJ",
"32,2014-06-22T23:23:06,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:23:48,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-22T23:23:48,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:23:48,browser,video,GudxGLTs5za4ArMgX30DOW5dR5Erca5m",
"32,2014-06-22T23:24:45,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-22T23:24:45,server,access,b7jY5UjELslMZUZDW7OrUrU8kPeqc4fx",
"32,2014-06-22T23:25:38,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T07:20:05,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-29T07:20:10,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T07:20:10,server,access,b7jY5UjELslMZUZDW7OrUrU8kPeqc4fx",
"32,2014-06-29T07:20:16,server,access,PSjYLli3GRFSCsvRX8SbKhC6uC0uxoiM",
"32,2014-06-29T07:20:16,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T07:20:25,browser,problem,W0a2rpsbk4NaGPS6am63e0T6F9tuRVPX",
"32,2014-06-29T07:20:25,server,problem,W0a2rpsbk4NaGPS6am63e0T6F9tuRVPX",
"32,2014-06-29T07:20:32,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-29T07:20:32,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T07:20:38,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T07:20:38,server,access,b7jY5UjELslMZUZDW7OrUrU8kPeqc4fx",
"32,2014-06-29T07:21:18,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:20:22,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-29T14:20:28,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:20:28,server,access,b7jY5UjELslMZUZDW7OrUrU8kPeqc4fx",
"32,2014-06-29T14:20:32,server,access,PSjYLli3GRFSCsvRX8SbKhC6uC0uxoiM",
"32,2014-06-29T14:20:33,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:20:44,browser,problem,W0a2rpsbk4NaGPS6am63e0T6F9tuRVPX",
"32,2014-06-29T14:20:44,server,problem,W0a2rpsbk4NaGPS6am63e0T6F9tuRVPX",
"32,2014-06-29T14:21:13,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-29T14:21:13,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:21:30,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:21:31,server,access,b7jY5UjELslMZUZDW7OrUrU8kPeqc4fx",
"32,2014-06-29T14:22:19,server,access,Uy8jlkLCnSvTUVFHsNPK3HqikgQ6mogG",
"32,2014-06-29T14:22:20,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-29T14:29:38,browser,problem,U6sC3Uvz5CIcxtKguV7GbDiC5xQrUVk8",
"32,2014-06-29T14:35:57,browser,problem,U6sC3Uvz5CIcxtKguV7GbDiC5xQrUVk8",
"32,2014-06-29T14:40:22,browser,problem,U6sC3Uvz5CIcxtKguV7GbDiC5xQrUVk8",
"32,2014-06-29T14:52:18,browser,problem,U6sC3Uvz5CIcxtKguV7GbDiC5xQrUVk8",
"32,2014-06-29T14:52:20,browser,problem,U6sC3Uvz5CIcxtKguV7GbDiC5xQrUVk8",
"32,2014-06-30T14:41:33,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-06-30T14:41:42,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:41:43,server,access,DpjvyKN1AhW8wuxH5KHu7m4GZP1kFWWA",
"32,2014-06-30T14:41:50,server,access,Uy8jlkLCnSvTUVFHsNPK3HqikgQ6mogG",
"32,2014-06-30T14:41:50,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:43:04,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:43:05,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:44:50,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:44:50,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:44:51,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:45:53,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:45:54,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-06-30T14:45:55,server,discussion,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-07-02T00:09:59,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-07-02T00:10:04,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-07-02T00:10:04,server,access,DpjvyKN1AhW8wuxH5KHu7m4GZP1kFWWA",
"32,2014-07-02T00:10:14,server,access,Uy8jlkLCnSvTUVFHsNPK3HqikgQ6mogG",
"32,2014-07-02T00:10:15,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-07-02T00:15:32,browser,problem,rwWB2Ff8REO0cr2ythjHXOiVyVNum0id",
"32,2014-07-02T00:23:08,browser,problem,rwWB2Ff8REO0cr2ythjHXOiVyVNum0id",
"32,2014-07-02T00:23:10,browser,problem,rwWB2Ff8REO0cr2ythjHXOiVyVNum0id",
"32,2014-07-02T00:23:11,browser,problem,rwWB2Ff8REO0cr2ythjHXOiVyVNum0id",
"32,2014-07-03T00:41:04,server,nagivate,Oj6eQgzrdqBMlaCtaq1IkY6zruSrb71b",
"32,2014-07-03T00:41:17,server,access,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-07-03T00:41:17,server,access,DpjvyKN1AhW8wuxH5KHu7m4GZP1kFWWA",
"32,2014-07-03T00:41:28,server,access,Uy8jlkLCnSvTUVFHsNPK3HqikgQ6mogG",
"32,2014-07-03T00:41:28,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl",
"32,2014-07-03T00:42:01,browser,page_close,3T6XwoiMKgol57cm29Rjy8FXVFcIomxl"];

// var newData = [];
// data.forEach(function(row){
//   newData.push(row.split(','));
// })

// var User = function(enrollmentId, username){
//   this.enrollmentId = enrollmentId;
//   this.username = username;
// };

// User.prototype.addCourse = function(courseId) {
//   this.course.push(courseId);
// };


// ////////
// var modules = function(){
//   this.data = [];
// }

// modules.prototype.add = function(moduleId, eventType, log) {
//   var tempModule = new module(moduleId, eventType);
//   tempModule.addLog(log);
//   this.data.push(tempModule);
// };

// modules.prototype.findOne = function(moduleId) {
//   var temp = false;
//   this.data.forEach(function(val){
//     if (val.moduleId === moduleId)
//       temp = val;
//   });
//   return temp;
// };
// modules.prototype.merge = function() {
//   var temp = [];
//   this.data.forEach(function(md, idx, arr){
//     var exist = false;
//     for (var i = 0; i < temp.length; i++) {
//       if (temp[i].moduleId === md.moduleId){
//         temp[i].count++;
//         temp[i].logs.push(md.logs[0]);
//         arr.splice(idx,1);
//         exist = true;
//       }
//     };
//     if (!exist)
//       temp.push(md)
//   });
// };
// /////////
// var module = function(moduleId, eventType){
//   this.moduleId = moduleId;
//   this.eventType = eventType;
//   this.count = 1;
//   this.logs = [];
// };

// module.prototype.addLog = function(log) {
//   this.logs.push(log);
// };

// var dataset = new modules();
// for (var i = 0; i < newData.length; i++) {
//   dataset.add(newData[i][4], newData[i][3], newData[i]);
// };

// console.log(dataset.data.length);
// dataset.merge();
// console.log(dataset.data.length);
// console.log(dataset.data[0]);

// var count = 0;
// for (var i = 0; i < dataset.data.length; i++) {
//   count += dataset.data[i].count;
// };
// console.log(count);
