
import PromoteLoginHTML from './promoteLogin.html'

// nui.customization.promoteLogin.title  => Sign in
// nui.customization.promoteLogin.signin       => Sign in
// nui.customization.promoteLogin.alwaysSignin => Always Sign In automaticaly?
// nui.customization.promoteLogin.alwaysSigninInfo => 
//        Next time, bring me to the Sign In page and do not show this message again.<br/>(I will be automatically signed in when I am already logged in via the KU Leuven Central Login.) 
//        Breng me volgende keer onmiddellijk naar de login pagina en toon deze boodschap niet meer.<br>(Ik zal automatisch aangemeld zijn als ik reed ben ingelogd via de KU Leuven Central Login.)
// nui.customization.promoteLogin.ContinueAsGuest => Continue as guest
// nui.customization.promoteLogin.ContinueAsGuestExtra => Continue as guest
// nui.customization.promoteLogin.limitedAccess => Limited access for non-KU Leuven users
// nui.customization.promoteLogin.close_dialog => Close
// nui.customization.automatic_login.alwaysSignin => Ga meteen naar de loginpagina bij starten van Limo

class PromoteLoginController {
  constructor($scope, $mdDialog) {
    let self = this;
    let parentCtrl = self.parentCtrl.parentCtrl

    var url = window.location.href;
    self.NeverShowSignInPopup = false;
    var urlParam = "noLogin";
    urlParam = urlParam.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + urlParam + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

    if (results) {
      if (decodeURIComponent(results[2].replace(/\+/g, " "))) {
        console.log("Dont show login popup")
        self.NeverShowSignInPopup = true;
      }
    }

    parentCtrl.primolyticsService.userSessionManagerService.signInObservable.subscribe(() => {
      if (this.parentCtrl.parentCtrl.isLoggedIn == true) {
        $mdDialog.hide();
      }
    });

    $scope.primoPromoteLogin = '';
    $scope.showSignInPopup = function () {
      var parentEl = angular.element(document.body);
    
      if (!self.NeverShowSignInPopup) {
        $mdDialog.show({
          parent: parentEl,
          template: PromoteLoginHTML,
          locals: {
            primoPromoteLogin: $scope.primoPromoteLogin
          },
          controller: DialogController
        });
      }
    }

    function DialogController($scope, $mdDialog) {
      $scope.loginDialog = function () {
        parentCtrl.loginService.handleLoginClick();
      };

      $scope.closeDialog = function () {
        $mdDialog.hide();
      };
      $scope.changePromoteOption = function () {
        if ($scope.primoPromoteLogin === 'neverSignin' || $scope.primoPromoteLogin === 'alwaysSignin') {
          localStorage.setItem('primoPromoteLogin', $scope.primoPromoteLogin);
        } else {
          localStorage.removeItem('primoPromoteLogin');
          //sessionStorage.setItem('primoPromoteLogin', $scope.primoPromoteLogin);
        }
      };
    }

    Primo.user.then(user => {
      self.user = user;
      if (!self.user.isLoggedIn()() )  {
        if (localStorage['primoPromoteLogin'] === 'alwaysSignin') {
            /* Redirect to login */;
          parentCtrl.loginService.handleLoginClick();
        } else {
          if (!sessionStorage['primoPromoteLogin'] && !localStorage['primoPromoteLogin']) {
            $scope.showSignInPopup();
            sessionStorage.setItem('primoPromoteLogin', 'SignInPopup');
          }
        }
      }
    });
  }
}

PromoteLoginController.$inject = ['$scope', '$mdDialog'];

export let promoteLoginComponent = {
  name: 'custom-promote-login',
  config: {
    bindings: { parentCtrl: '<' },
    controller: PromoteLoginController,
    template: ''
  },
  enabled: true,
  appendTo: ['prm-user-area-expandable-after'],
  enableInView: '32KUL_KUL:KULeuven|32KUL_KATHO:VIVES'
}