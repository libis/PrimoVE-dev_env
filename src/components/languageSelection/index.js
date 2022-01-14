
class LanguageSelectionController {
    constructor($scope) {
        let self = this;
        let scope = $scope;
        var onlyshow_fr_FR_in_vid = ['ACV', 'BPB', 'FARO', 'FODFIN', 'KBC', 'RBINS', 'RMCA', 'KMKG', 'LIBAR', 'NBB', 'OFO', 'VDIC'];
        let parentEl = angular.element(document.querySelector('primo-explore'));
        if (! onlyshow_fr_FR_in_vid.includes( window.appConfig.vid  ) ) {
            parentEl.append( 
              "<style>prm-language-selection md-list-item[value='fr']{display:none !important;} md-option[value='fr_FR'] {display: none !important;}</style>"
            );            
        }

    }
}

LanguageSelectionController.$inject = ['$scope']

export let LanguageSelectionConfig = {
    name: 'custom-language-selection',  
    enabled: true,
    appendTo: 'prm-main-menu-after',
    enableInView: '.*',
    config: {  
      bindings: {
        parentCtrl: '<'
      },
      controller: LanguageSelectionController,
      template: ''
    }
  }
