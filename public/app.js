var app = angular.module('BoatApp', ['header','board','leaderboard','login','footer','sprite']);

app.controller('BoatCtrl', function ($scope,$window) {

  //socket
  var host =  window.location.hostname;
  var port =  host === 'localhost' ? '3002' : '443';
  var protocol = host === 'localhost' ? 'http://' : 'https://';
  $scope.host = {};
  $scope.host.msg = {txt:'Welcome!',color:'blue'};

  $scope.$root.socket = io.connect(protocol + host + ':' + port,{
    'sync disconnect on unload': true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  });

  $scope.$root.socket.on('connect', function(){
    //ensures the login process doesn't kick off before socket is connected.
    loadScript('modules/login/facebook.js', 'text/javascript', 'utf-8');
  });

  $scope.$root.socket.on('disconnected', function(){
  });

  var blockLogin = false;
  $scope.$root.socket.on('returnUser', function(resp){
    blockLogin = false;
    $scope.player = {};
    $scope.player.sprite = resp.sprite;
    $window.user.charSprite = resp.sprite;
    $scope.$root.showLogin = false;
  });

  $scope.$root.socket.on('returnSession', function(resp){
    if($scope.$root.showLeaderboard){
      window.location = '/';
    }
    $scope.$root.sessionID = resp;
    $scope.$root.socket.emit('getScore',resp, window.user.accessToken);
    $scope.$root.socket.emit('checkCompletion', resp, window.user.accessToken)
  });

  $scope.$root.socket.on('returnScore', function(resp){
    var amount = resp === null ? 0 : resp;
    $scope.player.msg = {txt:'$' + amount,color:'blue',direction:'left'};
  });

  $scope.$root.socket.on('returnCompletion', function(resp){
    if(resp.count === resp.max){
      $scope.$root.showPlayAgainButton = true;
      $scope.$root.socket.emit('getLeaderboard');
      $scope.$root.showLeaderboard = true;
    }
  });

  //watch for login data
  $scope.$watch(
    function () {
      return $window.user
    }, function(n,o){
      if(n){
        $scope.$root.isLoggedIn = true;
        blockLogin = true;
        $scope.$root.socket.emit('getPlayer', window.user.accessToken);

        if(n.charSprite){
          $scope.player = {};
          $scope.player.sprite = n.charSprite;

          //get user data from io
          $scope.$root.socket.emit('insertPlayer', 1, n.name, n.charSprite, window.user.accessToken);
        }
        else{
          if(!blockLogin){
            $scope.$root.showLogin = true;
          }
        }
      }
      else{
        $scope.$root.isLoggedIn = false;
      }
    }
  );

});