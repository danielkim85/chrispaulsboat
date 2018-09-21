angular.module('header', [])
  .directive('header', function($interval){
    return{
      scope:{
      },
      templateUrl: 'modules/header/header.tpl.html',
      link: function($scope){

        var weddingDate = new Date(2018, 8, 23);
        //current date
        var current = new Date();
        if(weddingDate < current){
          $scope.weddingOver = true;
          return;
        }
        tikTok();
        $interval(tikTok,1000);

        //helper
        function tikTok(){
          var ts = countdown(weddingDate);

          if($scope.days !== ts.days) {
            $scope.days = ts.days;
          }

          if($scope.hours !== pad(ts.hours,2)){
            $scope.hours = pad(ts.hours,2);
          }

          if($scope.minutes !== pad(ts.minutes,2)){
            $scope.minutes = pad(ts.minutes,2);
          }

          $scope.seconds = pad(ts.seconds,2);
        }

        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
      }
    };
  });