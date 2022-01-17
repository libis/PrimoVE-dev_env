
class HideVirtualBroweController {
  constructor($scope, $translate, $rootScope) {

    let self = this
    self.$scope = $scope
    self.$translate = $translate;
    self.$rootScope = $rootScope
    //var hide_in_vid = ['32KUL_KUL:KULeuven'];
    var service = {
      title: 'brief.results.tabs.browseshelf',
      scrollId: 'virtualBrowse'
    }

    let translatorWatcher = $scope.$watch(() => {
      return self.$translate.isReady()
    }, (n, o) => {
      if (n == true) {
        //if (hide_in_vid.includes(window.appConfig.vid)) {
          var s = document.createElement("style");
          s.setAttribute("id", 'style_' + service["scrollId"]);
          s.innerHTML = ""
          s.innerHTML += "div#services-index button[aria-label=\"" + self.$translate.instant(service["title"]) + "\"] { display: none !important;}";
          s.innerHTML += "div.full-view-section#" + service["scrollId"] + " { display: none !important;}";

          document.getElementsByTagName("primo-explore")[0].appendChild(s);
        //}
        translatorWatcher();
      }
    }, false);
  }
}

HideVirtualBroweController.$inject = ['$scope', '$translate', '$rootScope']

export let hideVirtualBroweConfig = {
  name: 'custom-hide-virtual-browse',
  enabled: true,
  appendTo: 'prm-explore-footer-after',
  enableInView: '32KUL_KUL.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: HideVirtualBroweController,
    template: ''
  }
}
