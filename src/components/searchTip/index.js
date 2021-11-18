import searchTipHTML from './searchTip.html'
import tip_enUS_HTML from './enUS.html'
import tip_frFR_HTML from './frFR.html'
import tip_nlBE_HTML from './nlBE.html'

class SearchTipController {
  constructor($scope, $http, $mdDialog) {
    let self = this;

    Primo.view.then(view => {
      let locale = view.interfaceLanguage;
      //locale = window.Primo.explore.helper.userSessionManagerService().i18nService.getLanguage();
      //console.log(locale);
      let vid = view.code;

      let locale_text = {
        'nl': {
          'title': 'Zoektips',
          'title_label': "Zoektips weergeven"
        },
        'en': {
          'title': 'Search Tips',
          'title_label': "Search Tips"
        },
        'fr': {
          'title': 'Astuces?',
          'title_label': "Astuces?"
        },
      }

      let tipsHTML = tip_enUS_HTML;
      switch (locale) {
        case 'fr':
          tipsHTML = tip_frFR_HTML;
          break;
        case 'nl':
          tipsHTML = tip_nlBE_HTML;
          break;
        default:
          tipsHTML = tip_enUS_HTML;
      }

      $scope.title = locale_text[locale]['title'];
      $scope.title_label = locale_text[locale]['title_label'];

      $scope.showSearchTips = function ($event) {
        let parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          template: tipsHTML,
          locals: {
            items: $scope.items
          },
          controller: DialogController
        });
      }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function () {
          $mdDialog.hide();
        }
      }
    });
  }
}

SearchTipController.$inject = ['$scope', '$http', '$mdDialog']

export let searchTipConfig = {
  name: 'prm-searchtips',
  enabled: true,
  appendTo: null,
  enableInView: '.*',
  config: {
    bindings: { parentCtrl: '<' },
    controller: SearchTipController,
    template: searchTipHTML
  }
}

