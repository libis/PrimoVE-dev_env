import libInfoHTML from './libInfo.html'
import libInfoJSON from './libInfo.json'

class LibInfoController {
  constructor($translate, $mdMedia, $scope, $element) {
    let self = this;
    self.element = $element;
    self.hideLabel = false;
    self.mediaQueries = $mdMedia;
    self.scope = $scope;
    self.sourceURL = '';
    self.translate = $translate;
    self.XSElement = self.element.parent().parent().parent();
    self.iconUrl = `custom/41SLSP_NETWORK-CENTRAL_PACKAGE/img/information.png`;    
    
    self.translate('nui.customizing.idslu.informationicon').then((iconUrl) => {
      if (iconUrl !== 'informationicon') {
        self.iconUrl = iconUrl;
      }
    });              

    let mediawatcher = $scope.$watch(() => {      
      return self.mediaQueries('xs') || false;
    }, (xs) => {

      self.hideLabel = xs;          
      if (self.hideLabel) {
        self.XSElement.removeClass('layout-row');
        self.XSElement.removeClass('layout-align-space-between-end');
        self.XSElement.addClass('layout-column');
        self.XSElement.addClass('layout-align-space-between-start');
      } else {
        self.XSElement.addClass('layout-row');
        self.XSElement.addClass('layout-align-space-between-end');
        self.XSElement.removeClass('layout-column');
        self.XSElement.removeClass('layout-align-space-between-start');
      }
    });    
  }
  
  $onInit() {
    if (self.mediaQueries) {
      self.hideLabel = self.mediaQueries('xs');
    }
  }

  $doCheck(){ 
    if (this.location && this.sourceURL == '') {
      let location = libInfoJSON[this.location.libraryCode];    
      if (location) {
        this.sourceURL = location.url;
      } 
    }
  }
}

LibInfoController.$inject = ['$translate', '$mdMedia', '$scope', '$element'];

export let libInfoComponent = {
  name: 'custom-lib-info',
  config: {
    bindings: { location: '<', library: '<' },
    controller: LibInfoController,
    template: libInfoHTML
  },
  enabled: false,
  appendTo: null,
  enableInView: '.*'
}