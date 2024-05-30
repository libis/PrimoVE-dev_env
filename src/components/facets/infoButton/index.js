import facetInfoButtonHTML from './facetInfoButton.html'
import facetInfoButtonDialogHTML from './facetInfoButtonDialog.html'

class facetInfoButtonController {
  constructor($element, $compile, $scope, $mdDialog, $translate, $http,  MessageService) {
    this.$element = $element;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$translate = $translate;
    this.$http = $http;
    this.MessageService = MessageService;
  }

  $onInit() {
    let self = this;
    self.parentCtrl = this.parentCtrl.parentCtrl;


    let facetWatcher = self.$scope.$watch(() => {
      let facetGroup = self.parentCtrl.facetGroup.name == "lds13"
      let facetGroupSpan = self.$element.parent().parent().find("h3").find("button").find("span")
      return facetGroup && facetGroupSpan.length > 0 
    }, (n, o) => {
      if (n == true) {
        self.showfacetInfoButton();
        facetWatcher(); //deregister watcher
      }
    }, false);
  }
  
  showfacetInfoButton() {
    var self = this;
    var appendButtonTo = self.$element.parent().parent().find("h3").find("button").find("span")
    appendButtonTo.after(self.$compile(facetInfoButtonHTML)(self.$scope))
  }

  showfacetInfo() {
    var self = this;
    self.$mdDialog.show({
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      template: facetInfoButtonDialogHTML,
      controller:  function ($scope, $mdDialog) {
        $scope.local = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() ||  "en";
        $scope.closeDialog = function () {
          $mdDialog.hide();
        }
      }
 
   })
  }
}

facetInfoButtonController.$inject = ['$element', '$compile', '$scope', '$mdDialog', '$translate', '$http', 'MessageService'];
  

export let facetInfoButtonConfig = {
  name: 'custom-facet-info-button',
  enabled: true,
  appendTo: "prm-facet-exact-after",
  enableInView: '32KUL_KUL:Lirias',
  config: {
    bindings: { parentCtrl: '<' },
    controller: facetInfoButtonController,
    template: ''
  }
}