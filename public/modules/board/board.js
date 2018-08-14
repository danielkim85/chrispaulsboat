angular.module('board', [])
  .directive('board', function($interval,$timeout){
    return{
      scope:{
      },
      templateUrl: 'modules/board/board.tpl.html',
      link: function($scope){
        $('board').block({ message: 'Loading ...' });

        var progress_ = {};

        function updateBoard(categoryID, amount, correct){
          var obj = $('.category[categoryID="' + categoryID + '"] .question-container[amount="' + amount + '"] .question');
          obj.css('cursor','default');
          obj.removeClass('uk-animation-scale-down');
          obj.removeClass('blue-background');

          if(correct){
            obj.addClass('blue-foreground');
            obj.html('CORRECT');
          }
          else{
            obj.addClass('red-foreground');
            obj.html('WRONG');
          }
        }

        $scope.$root.$watch('socket',function(newValue){
          console.info('socket ready');
          console.info($scope.$root.socket);
          if(!newValue){
            return;
          }

          $scope.$root.socket.emit('getCategories', 1);

          $scope.$root.socket.on('returnCategories', function(resp){
            console.info('categories returned');
            console.info(resp);
            $scope.categories = resp;
          });

          $scope.$root.socket.on('returnQuestion', function(resp){
            if(resp === null){
              //error
              console.error('Querstion not found!');
            }
            else {
              $scope.question = resp[0].question;
              questionID = resp[0].questionID;
              $scope.answers = resp;

              //soundboard
              var audio = new Audio('assets/audio/board_fill.mp3');
              audio.play();
            }
          });

          $scope.$root.socket.on('returnAnswer', function(resp){
            if(!progress_[category_]){
              progress_[category_] = {};
            }
            progress_[category_][amount_] = { correct : resp };
            $scope.$parent.host.moving = true;
            $timeout(function(){
              $scope.$parent.host.moving = false;
            },3000);

            //if correct
            var audio;
            if(resp){
              $scope.$parent.host.msg = {txt:'Correct!',color:'blue'};
              //soundboard
              audio = new Audio('assets/audio/correct.mp3');
              audio.play();
            }
            else{
              $scope.$parent.host.msg = {txt:'Incorrect!',color:'red'};
              //soundboard
              audio = new Audio('assets/audio/wrong.mp3');
              audio.play();
            }

            $scope.$root.socket.emit('getScore',$scope.$root.sessionID);
            updateBoard(category_,amount_,resp);
            $scope.showQuestionBoard = false;

          });

          $scope.$root.socket.on('returnProgress', function(resp){
            resp.forEach(function(progress){
              var categoryID = progress.categoryID;
              var amount = progress.amount;
              if(!progress_[categoryID]){
                progress_[categoryID] = {};
              }
              progress_[categoryID][amount] = {};
              progress_[categoryID][amount].correct = progress.correct;

              updateBoard(categoryID,amount,progress.correct);
            });
            $('board').unblock();
          });
        });

        $scope.$root.$watch('isLoggedIn',function(n){
          if(!n){
            $scope.showQuestionBoard = false;
          }
        });

        $scope.$root.$watch('sessionID',function(n){
          if(n){
            $scope.$root.socket.emit('getProgress', n);
          }
        });

        $scope.questions = [
          {amount:200},
          {amount:400},
          {amount:600},
          {amount:800},
          {amount:1000}
        ];

        var category_, amount_;
        $scope.chooseQuestion = function(categoryID,amount){
          if(!window.user){
            $scope.$root.showLogin = true;
            return;
          }
          if(progress_[categoryID] && progress_[categoryID][amount]){
            return;
          }

          category_ = categoryID;
          amount_ = amount;
          $scope.$root.socket.emit('getQuestion', categoryID, amount);
          $scope.showQuestionBoard = true;
        };

        var questionID;
        $scope.chooseAnswer = function(answerID){
          $scope.$root.socket.emit('checkAnswer', questionID, answerID, window.user.email);
        };
      }
    };
  });