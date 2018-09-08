angular.module('login', [])
  .directive('login', function(){
    return{
      scope:{
      },
      templateUrl: 'modules/login/login.tpl.html',
      link: function($scope){

        loadScript('https://apis.google.com/js/platform.js?onload=renderButton', 'text/javascript', 'utf-8');

        var modal = UIkit.modal("#modalLogin");

        $scope.$root.$watch('showLogin',function(n){
          if(n){
            modal.show();
          }
          else{
            modal.hide();
          }
        });

        $scope.$root.$watch('isLoggedIn',function(n){
          if(n){
            if($scope.charSprite){
              window.user.charSprite = $scope.charSprite;
              $scope.user = undefined;
              $scope.$root.showLogin = false;
            }
            else {
              $scope.user = {};
              $scope.user.type = window.user.type;
              $scope.charName = window.user.name;
            }
          }
          else{
            $scope.user = undefined;
          }
        });

        $scope.closeLoginModal = function(){
          $scope.$root.showLogin = false;
        };

        $scope.pickChar = function(charId, charSprite){
          $scope.errorMsg = undefined;
          $('.char').removeClass('uk-card-primary');
          $('#' + charId).addClass('uk-card-primary');
          $scope.char1.moving = false;
          $scope.char2.moving = false;
          $scope[charId].moving = true;
          $scope.charSprite = charSprite;
        };

        $scope.start = function(){
          if(!$scope.charName || $scope.charName === ''){
            $scope.errorMsg = 'Provide a name!';
            return;
          }
          if(!$scope.charSprite){
            $scope.errorMsg = 'Pick a character!';
            return;
          }

          window.user = {
            type:$scope.user.type,
            email:window.user.email,
            name:$scope.charName,
            picture:window.user.picture,
            charSprite:$scope.charSprite,
            accessToken:window.user.accessToken
          };

          $scope.user = undefined;
          $scope.$root.showLogin = false;

        };

        $scope.char1 = {};
        $scope.char2 = {};

        $('.char').hover(
          function(){
            var id = $(this).attr('id');
            $scope[id].moving = true;
            $('#' + id).addClass('uk-card-secondary');
          },
          function(){
            var id = $(this).attr('id');
            if(!$('#' + id).hasClass('uk-card-primary')) {
              $scope[id].moving = false;
            }
            $('#' + id).removeClass('uk-card-secondary');
          }
        );
      }
    };
  });