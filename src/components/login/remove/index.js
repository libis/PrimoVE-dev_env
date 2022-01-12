class RemoveLoginController {
  constructor($scope,$element) {
    let self = this;

    // $ctrl.isLoggedInIDP()
    self.parentCtrl = this.parentCtrl.parentCtrl
    
    // remove "Sign in" button in menu and link to library card
    if(typeof self.parentCtrl.isSignedIn === "function"){
      var s = document.createElement("style");
      s.innerHTML = "prm-user-area-expandable > button, md-menu-item.my-library-card-ctm { display: none !important }";
      $element.append(angular.element(s));
    }

    // remove "Sign in" Alert above resultlist
    if(typeof  self.parentCtrl.isLoggedInIDP === "function"){
      self.parentCtrl.isLoggedInIDP = function() { return true };
    }
  
    // remove "Sign in" Alert in "How to get it"
    if( self.parentCtrl.reqAlert ){
      var s = document.createElement("style");
      s.innerHTML = "alma-htgi-tabs > prm-alert-bar { display: none  !important }";
      $element.append(angular.element(s));
    }

  }
}

RemoveLoginController.$inject = ['$scope','$element'];

export let RemoveLoginComponent = {
  name: 'custom-remove-login',
  config: {
    bindings: { parentCtrl: '<' },
    controller: RemoveLoginController,
    template: ''
  },
  enabled: true,
  appendTo: ['prm-search-after','prm-user-area-expandable-after','prm-request-services-after','alma-htgi-tabs-after'],
  enableInView: '.*Lirias'
}