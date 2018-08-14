angular.module('footer', [])
  .directive('footer', function($rootScope){
    return{
      scope:{
      },
      templateUrl: 'modules/footer/footer.tpl.html',
      link: function($scope){

        $scope.login = function(){
          $rootScope.showLogin = true;
        };

        $scope.getLeaderboard = function(){
          $scope.$root.socket.emit('getLeaderboard');
        };

        $scope.logout = function(){
          var user = window.user.type;
          if(user === 'google'){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
              window.user = false;
              auth2.disconnect();
            });
          }
          else if(user === 'facebook'){
            FB.logout(function(response) {
              window.user = false;
            });
          }
        }
      }
    };
  });