(function(){
  var app = angular.module('consultorio.specialtystore', []);
  app.factory('SpecialtyStore', function() {
    var specialties = angular.fromJson(window.localStorage['specialties']) || [];
    function persist() {
      window.localStorage['specialties'] = angular.toJson(specialties);
    }
    return {
      list: function() {
        return specialties;
      },
      create: function(name) {
        specialties.push({id: new Date().getTime().toString(), name: name});
        persist();
      },
      remove: function(id) {
        for(var i = 0; i < specialties.length; i++) {
          if(specialties[i].id === id) {
            specialties.splice(i, 1);
            persist();
            return;
          }
        }
      }
    };
  });
}());
