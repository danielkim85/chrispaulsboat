angular.module('board', [])
  .directive('board', function($interval,$timeout){
    return{
      scope:{
      },
      templateUrl: 'modules/board/board.tpl.html',
      link: function($scope){

        $scope.$root.$watch('socket',function(newValue){
          if(!newValue){
            return;
          }

          $scope.$root.socket.emit('getCategories', 'cpb');

          $scope.$root.socket.on('returnCategories', function(resp){
            $scope.categories = JSON.parse(resp);
          });

          $scope.$root.socket.on('returnQuestion', function(resp){
            if(resp === null){
              //error
              console.error('Querstion not found!');
              return;
            }
            else {
              resp = JSON.parse(resp);
              $scope.question = resp.question;
              $scope.answers = resp.answers;
            }
          });

          $scope.$root.socket.on('returnAnswer', function(resp){
            console.info(resp);

            $scope.$parent.host.moving = true;
            $timeout(function(){
              $scope.$parent.host.moving = false;
            },3000);

            if(resp.result){
              $scope.$parent.host.msg = {txt:'Correct!',color:'blue'};
            }
            else{
              $scope.$parent.host.msg = {txt:'Incorrect!',color:'red'};
            }

            $scope.showQuestionBoard = false;

          });
        });

        $scope.questions = [
          {amount:200},
          {amount:400},
          {amount:600},
          {amount:800},
          {amount:1000},
        ];

        var category_, amount_;

        $scope.chooseQuestion = function(category,amount){
          console.info(category + ' ' + amount);
          category_ = category;
          amount_ = amount;
          $scope.$root.socket.emit('getQuestion', 'cpb', category, amount);
          $scope.showQuestionBoard = true;
        };

        $scope.chooseAnswer = function(answer){
          console.info(category_ + ' ' + amount_ + ' ' + answer);
          $scope.$root.socket.emit('checkAnswer', 'cpb', category_, amount_, answer);
        };
      }
    };
  });