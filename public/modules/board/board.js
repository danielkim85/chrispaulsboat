angular.module('board', [])
  .directive('board', function($interval){
    return{
      scope:{
      },
      templateUrl: 'modules/board/board.tpl.html',
      link: function($scope){
        $scope.categories = [
          {name:'Boat'},
          {name:'Friends'},
          {name:'Family'},
          {name:'Sports'},
          {name:'CT'},
          {name:'General'}
        ];

        $scope.questions = [
          {amount:200},
          {amount:400},
          {amount:600},
          {amount:800},
          {amount:1000},
        ];

        $scope.chooseQuestion = function(categoryName,amount){
          console.info(categoryName);
          console.info(amount);
        }
      }
    };
  });