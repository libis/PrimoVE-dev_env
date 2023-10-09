angular.module('sparkcentral', ['angularLoad']).run(['angularLoad',(angularLoad) => {
  angularLoad.loadScript('https://cdn.sparkcentral.com/rtm/web/1.17.0/sparkcentral.1.17.0.min.js').then(function () {
      console.log('sparkcentral loaded');
  });  
}]);
