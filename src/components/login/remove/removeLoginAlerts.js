class RemoveLoginAlertsController {

  constructor($element) {
    this.$element = $element;
  }

  $onInit() {
    let self = this;
    self.parentCtrl = this.parentCtrl.parentCtrl

    // remove "Sign in" Alert above resultlist
    if (typeof self.parentCtrl.isLoggedInIDP === "function") {
      self.parentCtrl.isLoggedInIDP = function () { return true };
    }

    // remove "Sign in" Alert in "How to get it"
    if (self.parentCtrl.reqAlert) {
      var s = document.createElement("style");
      s.innerHTML = "prm-alert-bar { display: none  !important }";
      self.$element.append(angular.element(s));
    }

  }
}

RemoveLoginAlertsController.$inject = ['$element'];

export let RemoveLoginAlertsComponent = {
  name: 'custom-remove-login-alerts',
  config: {
    bindings: { parentCtrl: '<' },
    controller: RemoveLoginAlertsController,
    template: ''
  },
  enabled: true,
  appendTo: ['prm-search-after'],
  enableInView: '.*Lirias|32KUL_ACV:ACV.*|32KUL_BPB:BPB.*|32KUL_DOCVB:docvlaamsbrabant.*|32KUL_VCV:FARO.*|32KUL_FIN:FODFIN.*|32KUL_GSB.*|32KUL_GSG.*|32KUL_IMEC:IMEC.*|32KUL_KADOC:KADOC.*|32KUL_KBC:KBC.*|32KUL_KMKG:KMKG.*|32KUL_NBB:NBB.*|32KUL_RBINS:RBINS.*|32KUL_RMCA:RMCA.*|32KUL_TIFA:BOSA.*|32KUL_VLP:VLP.*|32KUL_VES:VDIC$|32KUL_VES:VDIC_TEST|.*JESUITS.*|32KUL_KHL:UCLL|32KUL_KUL:sportimonium'
}



