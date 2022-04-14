class RemoveBlocksController {
  constructor($scope, $compile) {
    this.parentCtrl.parentCtrl.accountOverviewService._requiredTabsList  =  this.parentCtrl.parentCtrl.requiredTabsList.filter( (tab) => { return tab != "blocks" } ) 
  }
}

RemoveBlocksController.$inject = ['$scope', '$compile'];

export let removeBlockscomponent = {
  name: 'custom-remove-blocks',  
  enabled: true,
  appendTo: 'prm-account-overview-after',
  enableInView: '^49ECB_INST:ECB',
  config: {
    bindings: {parentCtrl: '<'},
    controller: RemoveBlocksController,
    template: ''
  }
}
