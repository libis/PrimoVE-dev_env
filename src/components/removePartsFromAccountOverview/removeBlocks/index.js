class RemoveBlocksController {
  constructor() {
  }
  $onInit() {
    this.parentCtrl.parentCtrl.accountOverviewService._requiredTabsList = this.parentCtrl.parentCtrl.requiredTabsList.filter( (tab) => { return tab != "blocks" } ) 
  }
}

RemoveBlocksController.$inject = [];

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
