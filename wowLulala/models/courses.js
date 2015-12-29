var Course = require('./course');

var Courses = function(){
  this.courses = [];
  this.courseIdList = [];
  this.coursesCount = 0;
  this.isCourseExist = check;
};


var check  = function(courseRawId) {
  var temp = false;
  this.courseIdList.forEach(function(Id){
    if (Id === courseRawId)
      temp = true;
  });
  return temp;
};

Courses.prototype.addCourse = function(data) {
  if ( !this.isCourseExist(data[0]) ){
    var tempCourse = new Course(data[0]);
    tempCourse.update(data);
    this.courses.push(tempCourse);
    this.courseIdList.push(data[0]);
    this.coursesCount++;
  } else {
    var course;
    this.courseIdList.forEach(function(id, idx, arr){
      if (id === data[0]){
        course = this.courses[idx];
      }
    },this);
    course.update(data);
  }
};

Courses.prototype.constructMap = function() {
  this.courses.forEach(function(course){
    course.merge();
  })
};

module.exports = Courses;