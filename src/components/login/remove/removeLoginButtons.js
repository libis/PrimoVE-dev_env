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
  appendTo: ['prm-user-area-expandable-after'],
  enableInView: '.*Lirias|32KUL_DOCVB:docvlaamsbrabant|32KUL_GSB*|32KUL_GSG.*|32KUL_KMMR.*|32KUL_VES.*|.*JESUITS.*|.*DOKS.*'
}