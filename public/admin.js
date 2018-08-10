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
    var categories = [1,2,3,4,5,6];
    var amounts = [200,400,600,800,1000];
    var question = '1 + 2 = ?';
    categories.forEach(function(category){
      amounts.forEach(function(amount){
        $scope.socket.emit('uploadQuestion', question, amount,category);
      });
    });

    for(var i = 1; i <= 30; i++){
      for(var j = 0; j < 4; j++){
        var correct = j === 2 ? 1 : 0;
        $scope.socket.emit('uploadAnswer', j, correct,i);
      }
    }
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