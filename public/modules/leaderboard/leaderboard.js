angular.module('leaderboard', [])
  .directive('leaderboard', function(){
    return{
      scope:{
      },
      templateUrl: 'modules/leaderboard/leaderboard.tpl.html',
      link: function($scope){
        console.info('leaderboard loading ...');
        var modal = UIkit.modal("#modalLeaderboard");

        $scope.$root.$watch('showLeaderboard',function(n){
          if(n){
            modal.show();
          }
          else{
            modal.hide();
          }
        });

        $scope.$root.socket.on('returnLeaderboard', function(resp){
          console.info(resp);
          $scope.$root.showLeaderboard = true;
          $scope.winners = resp;
        });

      }
    };
  });