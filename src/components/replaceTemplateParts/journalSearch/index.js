import mdCardHTML from './mdCard.html'

class EditjournalSearchTextcomponentController {

  constructor($scope, $compile) {
    this.$scope = $scope;
  }

  $onInit() {
    let self = this;
    self.parentCtrl = self.$scope.$parent.$parent.$parent.$parent.$ctrl;   
    let $scope = self.$scope;
  }

}

EditjournalSearchTextcomponentController.$inject = ['$scope', '$compile'];

export let editjournalSearchTextcomponent = {
  name: 'custom-edit-journalsearch-text',
  enabled: true,
  appendTo: 'prm-journals-after',
  enableInView: '.*',  
  config: {
    bindings: {parentCtrl: '<'},
    controller: EditjournalSearchTextcomponentController,
    template: mdCardHTML
  }
}
