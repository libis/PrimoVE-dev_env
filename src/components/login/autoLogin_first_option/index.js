
class AutoLoginFirstOptionController {
  constructor($scope) { 
    this.$scope = $scope;
  }

  $onInit() {
    var self = this;
    self.parentCtrl = this.parentCtrl.parentCtrl;
    /*
    console.log ( "AutoLoginFirstOptionController" )
    console.log ( self )
    console.log ( self.parentCtrl.authenticationMethods )
    console.log ( self.parentCtrl.authenticationMethods[0] )    
    */
   
    self.parentCtrl.handleLoginClick( self.parentCtrl.authenticationMethods[0] )      

    
    
  }
}

AutoLoginFirstOptionController.$inject = ['$scope'];

export let AutoLoginFirstOptionComponent = {
  name: 'custom-automatic-login-first-option',
  config: {
    bindings: { parentCtrl: '<' },
    controller: AutoLoginFirstOptionController,
    template: ''
  },
  enabled: true,
  appendTo: 'prm-login-after',
  enableInView: '^32KUL_KUL:(?!KULeuven_ra|KULeuven_TEST)'
}