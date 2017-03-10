(function(){
  var app = angular.module('consultorio.patientstore', []);
  app.factory('PatientStore', function() {
    var patients = angular.fromJson(window.localStorage['patients']) || [];
    function persist() {
      window.localStorage['patients'] = angular.toJson(patients);
    }
    return {
      list: function() {
        return patients;
      },
      create: function(name) {
        patients.push({id: new Date().getTime().toString(), name: name});
        persist();
      }
    };
  });
}());
