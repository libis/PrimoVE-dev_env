import autoLoginCheckboxHTML from './autoLoginCheckbox.html'

class AutoLoginCheckboxController {
  constructor($scope) {
    var self = this;
    /* Remove the localStorage parameter primoPromoteLogin if the url contains clearLogin */
    self.NeverShowSignInPopup = false;
    self.alwaysSigninCheckBox = false;
    self.alwaysSignin = localStorage.getItem("primoPromoteLogin");

    var url = window.location.href;
    var urlParam = "clearLogin";
    urlParam = urlParam.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + urlParam + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (results) {
      if (decodeURIComponent(results[2].replace(/\+/g, " "))) {
        localStorage.removeItem('primoPromoteLogin');
      }
    }
   
    var urlParam = "noLogin";
    urlParam = urlParam.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + urlParam + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

    if (results) {
      if (decodeURIComponent(results[2].replace(/\+/g, " "))) {
        console.log ("Dont show login popup")
        self.NeverShowSignInPopup = true;
      }
    }
    
    if (self.alwaysSignin) {
      self.alwaysSigninCheckBox = true;
    }

    $scope.alwaysSigninChecked = function () {
      if (self.alwaysSigninCheckBox) {
        localStorage.setItem('primoPromoteLogin', 'alwaysSignin');
      } else {
        localStorage.removeItem('primoPromoteLogin');
      }
    };
    
  }
}

AutoLoginCheckboxController.$inject = ['$scope'];

export let AutoLoginCheckboxComponent = {
  name: 'custom-automatic-login',
  config: {
    bindings: { parentCtrl: '<' },
    controller: AutoLoginCheckboxController,
    template: autoLoginCheckboxHTML
  },
  enabled: true,
  appendTo: ['lbs-promote-login'],
  enableInView: '32KUL_KUL:KULeuven|32KUL_KATHO:VIVES'
}