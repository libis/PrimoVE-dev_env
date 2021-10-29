class RemoveFinesController {
  constructor($scope, $compile) {
    this.parentCtrl.parentCtrl.accountOverviewService._requiredTabsList  =  this.parentCtrl.parentCtrl.requiredTabsList.filter( (tab) => { return tab != "fines" } ) 
    /*
    this.scope = $scope;
    this.compile = $compile;
    */

  }
}

RemoveFinesController.$inject = ['$scope', '$compile'];

export let removeFinescomponent = {
  name: 'remove-fines',  
  enabled: true,
  appendTo: 'prm-account-overview-after',
  enableInView: '.*',  
  config: {
    bindings: {parentCtrl: '<'},
    controller: RemoveFinesController,
    template: ''
  }
}
