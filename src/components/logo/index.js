
///////////////////////////////////////////////////////////////////////////
// logo's must be placed in the <view>-dir
// - /img/library-logo-en.png
// - /img/library-logo-nl.png
// - /img/library-logo-fr.png
//
// link behind the logo can be configured
// or if translation is nessecaru in the code table 'View Labels'
//  nui.customization.institutionWebsiteUrl
//
////////////////////////////////////////////////////////////////////////////
class ViewLogoController {
  constructor($element, $scope, $translate, $http, $compile, $rootScope) {
    let self = this;
    this.element = $element;
    this.scope = $scope;
    this.pScope = $scope.$parent.$parent;
    this.compile = $compile;
    this.localeLibraryLogo = window.appConfig.customization.libraryLogo;
    this.instituteUrl = $translate.instant('nui.customization.institutionWebsiteUrl');
   
    
    Primo.view.then((view) => {
      //let vid = view.code;
      let vid = window.appConfig.vid
      let vidDir = vid.replace(":", "-");
      let locale = view.interfaceLanguage;
      let localeLibraryLogo = 'custom/' + vidDir + '/img/library-logo-' + locale + '.png';

      if (self.instituteUrl === 'nui.customization.institutionWebsiteUrl') {
        let watcher = $rootScope.$watch(() => {
          try {
            if ($translate.instant('nui.customization.institutionWebsiteUrl') == 'nui.customization.institutionWebsiteUrl') {
              return false;
            } else {
              return true;
            }
          } catch (e) {
            return false;
          }
        }, (n, o) => {
          if (n == true) {
            self.instituteUrl = $translate.instant('nui.customization.institutionWebsiteUrl');
            self.processInstituteUrl() 
            watcher();
          }
        });
      }else{
        self.instituteUrl = $translate.instant('nui.customization.institutionWebsiteUrl');
        self.processInstituteUrl() 
      }
      if (self.localeLibraryLogo !== localeLibraryLogo) {
        $http({
          method: 'GET',
          url: localeLibraryLogo,
        }).then(function (response) {

          window.appConfig.customization.libraryLogo = localeLibraryLogo;
          self.localeLibraryLogo = localeLibraryLogo
          self.compile(self.element[0].parentNode.parentNode)($scope.$parent.$parent);

        }, function (error) {
          self.localeLibraryLogo;
        });
      }


    });
  }

  processInstituteUrl() {
    if ( this.scope.$parent.$parent.$ctrl.logoURL != this.instituteUrl  ) {
      if (this.instituteUrl ) {
        if (this.instituteUrl  == 'http://www.libis.be/') {
          this.scope.$parent.$parent.$ctrl.logoURL =  '/primo-discovery/search?vid=' + vid + "&lang=" + locale;
        } else {
          this.scope.$parent.$parent.$ctrl.logoURL = this.instituteUrl 
        }
      };

      window.appConfig.customization.libraryLogoClickableURL = this.scope.$parent.$parent.$ctrl.logoURL;
       this.compile(this.element[0].parentNode.parentNode)(this.scope.$parent.$parent);
    }
  }


}

ViewLogoController.$inject = ['$element', '$scope', '$translate', '$http', '$compile', '$rootScope'];

export let viewLogoComponent = {
  name: 'custom-view-logo',
  config: {
    bindings: { parentCtrl: '<' },
    controller: ViewLogoController,
    template: ''
  },
  enabled: true,
  appendTo: 'prm-logo-after',
  enableInView: '.*'
}