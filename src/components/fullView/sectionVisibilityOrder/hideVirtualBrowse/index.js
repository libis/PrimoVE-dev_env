
class HideVirtualBroweController {
  constructor($scope,$translate,$rootScope) {

    let self = this
    self.$scope = $scope
    self.$rootScope = $rootScope
    var hide_in_vid = ['32KUL_KUL:KULeuven'];
    let service = { 
      title : 'brief.results.tabs.browseshelf',
      scrollId : 'virtualBrowse'
    }

    $rootScope.$on('$translateChangeSuccess', ()=>{
      if (hide_in_vid.includes(window.appConfig.vid)) {
        var s = document.createElement("style");
        s.setAttribute("id",  'style_'+ service["scrollId"] );
        s.innerHTML = ""
        s.innerHTML += "div#services-index button[aria-label=\""+   $translate.instant( service["title"] ) +"\"] { display: none !important;}";
        s.innerHTML += "div.full-view-section#"+ service["scrollId"] +" { display: none !important;}";

        document.getElementsByTagName("primo-explore")[0].appendChild(s);
      }
    });


  }
}

HideVirtualBroweController.$inject = ['$scope','$translate','$rootScope']

export let hideVirtualBroweConfig = {
  name: 'custom-hide-virtual-browse',
  enabled: true,
  appendTo: 'prm-explore-footer-after',
  enableInView: '.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: HideVirtualBroweController,
    template: ''
  }
}
