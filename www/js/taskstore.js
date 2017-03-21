(function(){
  var app = angular.module('consultorio.taskstore', []);
  app.factory('TaskStore', function() {
    var tasks = angular.fromJson(window.localStorage['tasks']) || [];
    function persist() {
      window.localStorage['tasks'] = angular.toJson(tasks);
    }
    return {
      list: function() {
        return tasks;
      },
      get: function(id) {
        return tasks.filter(function(task) {
          return task.id == id;
        })[0];
      },
      create: function(task) {
        tasks.push(task);
        persist();
      },
      changeActive: function(id) {
        tasks.filter(function(task) {
          return task.id == id;
        })[0].active = false;
        persist();
      },
      remove: function(id) {
        for(var i = 0; i < tasks.length; i++) {
          if(tasks[i].id === id) {
            tasks.splice(i, 1);
            persist();
            return;
          }
        }
      }
    };
  });
}());
