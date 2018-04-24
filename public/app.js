var app = angular.module('BoatApp', []);
app.controller('BoatCtrl', function ($scope) {

  var currentHour = new Date().getHours();

  //debug
  //currentHour = 7;

  if(currentHour <= 6 || currentHour >= 18){
    $('body').addClass('night');
  }
  else{
    $('body').addClass('day');
  }
});