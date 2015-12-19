var Modules = function(){
  this.data = [];
}

Modules.prototype.add = function(moduleId, eventType, log) {
  var tempModule = new Module(moduleId, eventType);
  tempModule.addLog(log);
  this.data.push(tempModule);
};

Modules.prototype.findOne = function(moduleId) {
  var temp = false;
  this.data.forEach(function(val){
    if (val.moduleId === moduleId)
      temp = val;
  });
  return temp;
};

Modules.prototype.merge = function() {
  var temp = [];
  this.data.forEach(function(md, idx, arr){
    var exist = false;
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].moduleId === md.moduleId){
        temp[i].count++;
        temp[i].logs.push(md.logs[0]);
        arr.splice(idx,1);
        exist = true;
      }
    };
    if (!exist)
      temp.push(md)
  });
};

// Singel Module

var Module = function(moduleId, eventType){
  this.moduleId = moduleId;
  this.eventType = eventType;
  this.count = 1;
  this.logs = [];
};

Module.prototype.addLog = function(log) {
  this.logs.push(log);
};

module.exports = Modules;