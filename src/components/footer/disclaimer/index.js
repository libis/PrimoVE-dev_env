
import cookiePolicyDialogHTML from './cookie_policy_en_US.html'
import disclaimerDialog_frFR_HTML from './cookie_policy_en_US.html'
import disclaimerDialog_nlBE_HTML from './cookie_policy_nl_BE.html'
import disclaimerDialog_enUS_HTML from './cookie_policy_en_US.html'
import Session from '../../../primo/session'

import disclaimerLinkHTML from './disclaimer.html'

class disclaimerController {
  constructor($scope, $mdDialog) {
    let self = this;

    self.view = Session.view;
    
    let locale = self.view.interfaceLanguage;

    let locale_text = {
      'nl': {
        'title': 'Cookiebeleid',
        'title_label': "Cookiebeleid"
      },
      'en': {
        'title': 'Cookie Policy',
        'title_label': "Cookie Policy"
      },
      'fr': {
        'title': 'Cookie Policy',
        'title_label': "Cookie Policy"
      },
    }

    //Todo Refactory disclaimerDialog / cookiePolicy ??? 
    //let disclaimerDialog = disclaimerDialogHTML; 
    let disclaimerDialog = cookiePolicyDialogHTML;
    switch (locale) {
      case 'fr':
      disclaimerDialog = disclaimerDialog_frFR_HTML;
        break;
      case 'nl':
      disclaimerDialog = disclaimerDialog_nlBE_HTML;
        break;
      default:
      disclaimerDialog = disclaimerDialog_enUS_HTML;
    }

    $scope.title = locale_text[locale]['title'];
    $scope.title_label = locale_text[locale]['title_label'];

    $scope.showDisclaimerDialog = function($event) {
      let parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: disclaimerDialog,
        locals: {
          items: $scope.items
        },
        controller: DialogController
      });
    }

    function DialogController($scope, $mdDialog, items) {
      $scope.items = items;
      $scope.closeDialog = function() {
        $mdDialog.hide();
      }
    }
  }
}

disclaimerController.$inject = ['$scope', '$mdDialog']


export let disclaimerConfig = {
  name: 'prm-disclaimer',
  enabled: true,
  appendTo: null,
  enableInView: '.*',
  config: {
    bindings: { parentCtrl: '<' },
    controller: disclaimerController,
    template: disclaimerLinkHTML
  }
}
