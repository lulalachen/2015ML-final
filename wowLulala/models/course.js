var Course = function(courseIdRaw, moduleId, category, children, courseStart){
  this.courseIdRaw = courseIdRaw;
  this.moduleId = moduleId;
  this.category = category;
  this.children = children;
  this.courseStart = courseStart;
}