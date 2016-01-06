var _ = require('underscore');
var fsp = require('fs-time-prefix');
var Course = function(Id){
  this.courseIdRaw = Id;
  this.stucture = {};
  this.modules = [];
  this.findParentChain = findParentChain;
}

Course.prototype.update = function(data){
  var children = data[3].split(' ');
  var childrenArray = [];
  children.forEach(function(each){
    if (each !== "")
      childrenArray.push(each);
  });
  this.modules.push({
    moduleId : data[1],
    category : data[2],
    children : childrenArray,
    courseStart : data[4]
  });
}

Course.prototype.merge = function() {
  var roots = [];
  var tempTree = [];
  this.modules.forEach(function(module){
    // if (module.children.length === 0){
      roots.push({
        id : module.moduleId,
        category : module.category,
        parents : this.findParentChain(module.moduleId)
      });
    // }
  },this);
  // var data = this.modules;
  // _.each(data, function(o){
  //   o.children.forEach(function (childrenId){
  //     _.findWhere(data, {moduleId : childrenId}).parent = o.moduleId;
  //   });
  // });
  // console.log(data);

  // console.log(JSON.stringify(treeify(this.modules, 'moduleId', '')));
  fsp.writeJsonFile('./results/parent.json',roots)
  console.log(JSON.stringify(roots));
};



function findParentChain (id){
  var chain = [];
  var temp;
  var top = true;
  this.modules.forEach(function(mod){
    for (var i = 0; i < mod.children.length; i++) {
      if (mod.children[i] === id){
        top = false;
        temp = mod.moduleId;
      }
    };
  });
  if (top){
    return chain;
  } else {
    chain.push(this.findParentChain(temp));
  }
  return temp;
}

module.exports = Course;