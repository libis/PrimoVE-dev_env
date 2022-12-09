
class HideLinksController {
  constructor($scope, $translate, $rootScope) {

    let self = this
    self.$scope = $scope
    self.$translate = $translate;
    self.$rootScope = $rootScope
    //var hide_in_vid = ['32KUL_KUL:KULeuven'];
    self.service = {
      title: 'nui.brief.results.tabs.links',
      scrollId: 'links'
    }

    let translatorWatcher = self.$scope.$watch(() => {
      return self.$translate.isReady()
    }, (n, o) => {
      if (n == true) {
        
        //if (hide_in_vid.includes(window.appConfig.vid)) {
          var s = document.createElement("style");
          s.setAttribute("id", 'style_' + self.service["scrollId"]);
          s.innerHTML = ""
          s.innerHTML += "div#services-index button[aria-label=\"" + self.$translate.instant( self.service["title"]) + "\"] { display: none !important;}";
          s.innerHTML += "div.full-view-section#" + self.service["scrollId"] + " { display: none !important;}";

          document.getElementsByTagName("primo-explore")[0].appendChild(s);
        //}

        translatorWatcher();
      }
    }, false);


  }
}

HideLinksController.$inject = ['$scope', '$translate', '$rootScope']

export let hideLinksConfig = {
  name: 'custom-hide-links',
  enabled: true,
  appendTo: 'prm-explore-footer-after',
  enableInView: '32KUL_KUL:Lirias.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: HideLinksController,
    template: ''
  }
}
