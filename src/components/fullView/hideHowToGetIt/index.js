
class HideHowToGetItController {
  constructor($scope, $translate, $rootScope) {

    let self = this
    self.$scope = $scope
    self.$translate = $translate;
    self.$rootScope = $rootScope
    //var hide_in_vid = ['32KUL_KUL:KULeuven'];
    var service = {
      title: 'nui.getit.service_howtogetit',
      scrollId: 'getit_link1_0'
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

HideHowToGetItController.$inject = ['$scope', '$translate', '$rootScope']

export let HideHowToGetItConfig = {
  name: 'custom-hide-how-to-get-it',
  enabled: true,
  appendTo: 'prm-explore-footer-after',
  enableInView: '32KUL_LIBIS_NETWORK:JESUITS_UNION',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: HideHowToGetItController,
    template: ''
  }
}
