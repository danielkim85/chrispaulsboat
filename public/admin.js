var app = angular.module('AdminApp', []);
app.controller('AdminCtrl', function ($scope) {

  $scope.categories = 'BOAT\nFRIENDS\nFAMILY\nSPORTS\nCT\nGENERAL';
  $scope.uploadCategories = function(){
    var categories = [
      'boat',
      'friends',
      'family',
      'sports',
      'ct',
      'general'
    ];
    categories = JSON.stringify(categories);
    $scope.socket.emit('uploadCategories', 'cpb', categories);
  };

  $scope.uploadQuestion = function(){
    var question = {
      question: '1 + 2 = ?',
      answers: ['0','10','3','4'],
      correct: 2
    };
    question = JSON.stringify(question);
    $scope.socket.emit('uploadQuestion', 'cpb', 'boat', 200, question);
  };

  $scope.test = function(){
    $scope.socket.emit('getQuestion', 'cpb', 'boat',200);
    $scope.socket.emit('checkAnswer', 'cpb', 'boat',200, 2);
  };


  //socket
  var protocol = "http://";
  var host =  window.location.hostname;
  var port =  host === 'localhost' ? '3002' : '80';
  $scope.socket = io.connect(protocol + host + ':' + port,{
    'sync disconnect on unload': true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  });

  $scope.socket.on('connect', function(){
    $scope.socket.on('returnQuestion', function(resp){
    });
    $scope.socket.on('returnAnswer', function(resp){
      console.info(resp);
    });
  });

  $scope.socket.on('disconnect', function(){
  });
});