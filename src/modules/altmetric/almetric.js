/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
angular.module('altmetric', ['ng','angularLoad']).run(['angularLoad',(angularLoad) => {
    angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(function () {
      console.log('altmerics.js loaded');
    });
}]);