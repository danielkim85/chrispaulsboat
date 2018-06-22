var app = angular.module('BoatApp', ['header','board','sprite']);
app.controller('BoatCtrl', function ($scope,$rootScope,$window) {

  //socket
  var protocol = "http://";
  var host =  window.location.hostname;
  var port =  host === 'localhost' ? '3002' : '80';

  $scope.host = {};
  $scope.host.msg = {txt:'Welcome!',color:'blue'};
  $rootScope.socket = io.connect(protocol + host + ':' + port,{
    'sync disconnect on unload': true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  });

  $rootScope.socket.on('connect', function(){
  });

  $rootScope.socket.on('disconnect', function(){
  });

  //watch for login data
  $scope.$watch(
    function () {
      return $window.user
    }, function(n,o){
      if(n){
        console.info(n);
      }
    }
  );


});