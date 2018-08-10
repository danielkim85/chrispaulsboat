angular.module('sprite', [])
  .directive('sprite', function($timeout){
    return{
      scope:{
        char:'@',
        size:'=',
        position:'=',
        moving:'=',
        msg:'='
      },
      templateUrl: 'modules/sprite/sprite.tpl.html',
      link: function($scope, $element){

        //consts & maps
        var PREFIX = 'modules/sprite/assets/';
        var POSITION_MAP = ['up','left','down','right'];
        var SIZE_MAP = ['small','large'];

        //input sanity check
        if($scope.size < 0 || $scope.size > 1){
          console.error('Invalid sprite size!');
          return;
        }

        if($scope.position < 0 || $scope.position > 3){
          console.error('Invalid sprite position!');
          return;
        }

        //initialization
        var size = $scope.size ? SIZE_MAP[$scope.size] : SIZE_MAP[0];
        var element = angular.element($element[0]);
        element.addClass(size);

        //watch
        $scope.$watch('position',function(newValue){
          var position = $scope.position ? POSITION_MAP[$scope.position] : POSITION_MAP[0];
          element.addClass(position);
        });

        $scope.$watch('char',function(n){
          if(n){
            var char = $scope.char;
            element.css('background-image','url(' + PREFIX + char + '-' + size + '.png)');
          }
        },true);

        var movingPromise;
        $scope.$watch('moving',function(newValue){
          if(newValue){
            movingPromise = $timeout(function(){
              var spriteWidth = parseInt(element.css('width').replace('px'));
              var currentPos = parseInt(element.css('background-position-x').replace('px'));
              updateMovement(currentPos,spriteWidth);
            });
          }else{
            $timeout.cancel(movingPromise);
          }
        });

        $scope.$watch('msg',function(newValue,oldValue) {
          if(!newValue || !newValue.color || (oldValue && !oldValue.color)) {
            return;
          }
          var bubble = angular.element($element[0].children[0]);

          if(oldValue && newValue.color !== oldValue.color){
            bubble.removeClass(oldValue.color + '-background');
            bubble.removeClass('speech-bubble-' + oldValue.color);
          }

          bubble.addClass(newValue.color + '-background');
          bubble.addClass('speech-bubble-' + newValue.color);

          if(newValue.direction){
            $scope.bDirection = '-' + newValue.direction;
          }
        });


        //helper functions
        function updateMovement(currentPos,spriteWidth){
          movingPromise = $timeout(function(){
            var newPos = (currentPos+spriteWidth) > (spriteWidth*2) ? 0 : currentPos+spriteWidth;
            element.css('background-position-x',newPos + 'px');
            updateMovement(newPos,spriteWidth);
          },250);
        }
      }
    };
  });