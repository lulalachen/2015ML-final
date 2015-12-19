var User = function(enrollmentId, username){
  this.enrollmentId = enrollmentId;
  this.username = username;
};

User.prototype.addCourse = function(courseId) {
  this.course.push(courseId);
};

module.exports = User;

