class RemoveLoginController {
  constructor($element) { 
    this.$element = $element;
  }

  $onInit() {
    let self = this;
    // $ctrl.isLoggedInIDP()
    self.parentCtrl = this.parentCtrl.parentCtrl
    
    // remove "Sign in" button in menu and link to library card
    if(typeof self.parentCtrl.isSignedIn === "function"){
      var s = document.createElement("style");
      s.innerHTML = "prm-user-area-expandable > button, md-menu-item.my-library-card-ctm { display: none !important }";
      self.$element.append(angular.element(s));
    }

  }
}

RemoveLoginController.$inject = ['$element'];

export let RemoveLoginComponent = {
  name: 'custom-remove-login',
  config: {
    bindings: { parentCtrl: '<' },
    controller: RemoveLoginController,
    template: ''
  },
  enabled: true,
  appendTo: ['prm-user-area-expandable-after'],
  enableInView: '.*Lirias|32KUL_DOCVB:docvlaamsbrabant|32KUL_GSG.*|32KUL_KMMR.*|32KUL_VES:VDIC$|32KUL_VES:VDIC_TEST|.*JESUITS.*|.*DOKS.*|32KUL_KUL:sportimonium'
}