angular.module('leaderboard', [])
  .directive('leaderboard', function(){
    return{
      scope:{
      },
      templateUrl: 'modules/leaderboard/leaderboard.tpl.html',
      link: function($scope){

        var modal = UIkit.modal("#modalLeaderboard");

        $scope.$root.$watch('showLeaderboard',function(n){
          if(n){

            //soundboard
            var audio = new Audio('assets/audio/clear.mp3');
            audio.play();

            modal.show();
          }
          else{
            modal.hide();
          }
        });

        $scope.$root.socket.on('returnLeaderboard', function(resp){
          $scope.$root.showLeaderboard = true;
          $scope.winners = resp;
        });

        $scope.createNewGame = function(){
          $scope.$root.socket.emit('createNewGame',1,window.user.email);
        };

      }
    };
  });