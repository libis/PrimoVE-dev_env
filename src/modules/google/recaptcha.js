angular.module('reCaptcha', ['angularLoad']).run(['angularLoad', '$rootScope', '$translate', (angularLoad, $rootScope, $translate) => {
    let self = this
    self.$rootScope = $rootScope;
    self.$translate = $translate;

    let watcher = $rootScope.$watch(() => {
      try {
        if (self.$translate.instant('nui.customization.recaptcha.publicCaptchaKey') == 'nui.customization.recaptcha.publicCaptchaKey') {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    }, (n, o) => {
      if (n == true) {

        let publicCaptchaKey = self.$translate.instant('nui.customization.recaptcha.publicCaptchaKey');
        window.recaptcha = {
          publicCaptchaKey: publicCaptchaKey
        };
        watcher();
      }
    })

}]);

