(function() {
  var app = angular.module('consultorio', ['ionic', 'ngCordova', 'timer', 'consultorio.patientstore', 'consultorio.specialtystore', 'consultorio.taskstore']);

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('add-task', {
      url: '/add-task',
      templateUrl: 'templates/add-task.html'
    });
    $stateProvider.state('active-tasks', {
      url: '/active-tasks',
      templateUrl: 'templates/active-tasks.html'
    });
    $stateProvider.state('history-tasks', {
      url: '/history-tasks',
      templateUrl: 'templates/history-tasks.html'
    });
    $stateProvider.state('add-patient', {
      url: '/add-patient',
      templateUrl: 'templates/add-patient.html'
    });
    $stateProvider.state('add-specialty', {
      url: '/add-specialty',
      templateUrl: 'templates/add-specialty.html'
    });
    $urlRouterProvider.otherwise('/add-task');
  });

  app.run(function($ionicPlatform, $rootScope, $timeout) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      if(ionic.Platform.isIOS()) {
        window.plugin.notification.local.promptForPermission();
      }
    });
  });

  app.controller('ListTaskCtrl', function($scope, TaskStore) {
    $scope.tasks = TaskStore.list();

    $scope.formatDate = function(date) {
      date = new Date(date);
      return ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2);
    };
  });

  app.controller('AddTaskCtrl', function($scope, $state, $cordovaLocalNotification, $cordovaVibration, PatientStore, SpecialtyStore, TaskStore) {
    $scope.patients = PatientStore.list();
    $scope.specialties = SpecialtyStore.list();

    $scope.$on('$cordovaLocalNotification:trigger', function (event, notification, state) {
      TaskStore.changeActive(notification.id);
      if(TaskStore.get(notification.id).vibrate) $cordovaVibration.vibrate(300);
    });

    $scope.add = function(patient, box, specialty, time, sound, vibrate) {
      var startTime = new Date();
      var endTime = new Date(startTime.getTime());
      endTime.setMinutes(startTime.getMinutes() + time);
      var id = startTime.getTime().toString();
      var notificationSound = null;
      if(sound) notificationSound = 'file://audio/notification.wav';
      // $cordovaLocalNotification.add({
      //   id: id,
      //   date: endTime,
      //   title: patient + ' (Box ' + box + ')',
      //   message: specialty.name + ' fin! (' + time + ' minuto' + ((time != 1)?'s':'') + ')',
      //   autoCancel: true,
      //   sound: notificationSound
      // }).then(function() {
        var task = { id: id, patient: patient, box: box, specialty: specialty, start: startTime, end: endTime, sound: sound, vibrate: vibrate, active: true };
        TaskStore.create(task);
      // });
      $scope.patient = '';
      $scope.box = '';
      $scope.specialty = '';
      $scope.time = '';
      $state.go('active-tasks');
    };
  });

  app.controller('PatientCtrl', function($scope, $state, PatientStore) {
    $scope.patients = PatientStore.list();

    $scope.add = function(name) {
      PatientStore.create(name);
      $scope.name = '';
      $state.go('add-task');
    }
  });

  app.controller('SpecialtyCtrl', function($scope, $state, SpecialtyStore) {
    $scope.specialties = SpecialtyStore.list();

    $scope.add = function(name) {
      SpecialtyStore.create(name);
      $scope.name = '';
      $state.go('add-task');
    }
  });

}());
