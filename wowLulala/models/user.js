var User = function(enrollmentId, username, courseId){
  this.enrollmentId = enrollmentId;
  this.username = username;
  this.courseId = courseId;
};

User.prototype.addLog = function(enrollmentId, logInRow) {
  console.log(logInRow);
};

module.exports = User;

