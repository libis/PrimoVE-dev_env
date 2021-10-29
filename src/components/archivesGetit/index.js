//import 'primo-explore-eth-archives-getit';

class ArchivesGetitController {
  constructor() {
    this.mainParentCtrl = this.parentCtrl;
  }
}

export let rzsArchivesComponent = {
    name: 'custom-archives-getit',  
    enabled: false,    
    appendTo: 'prm-alma-viewit-after',
    enableInView: '.*',  
    config: {      
      bindings: {parentCtrl: '<'},
      controller: ArchivesGetitController,
      template: '<eth-archives-getit-component after-ctrl="$ctrl.mainParentCtrl"></eth-archives-getit-component>'
    }
  }