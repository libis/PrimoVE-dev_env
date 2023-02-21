class AdvancedSearchChevronController {   
    constructor($scope){  
        this.$scope = $scope;
    }
    $onInit() {
        let self = this;
        let $scope = self.$scope;

        this.showLabel = false;
        // Show the label if this icon is chevron-up...
        if (angular.isDefined($scope.$parent.$parent)) {
          var icon = $scope.$parent.$parent;
          if (icon.$ctrl.iconDefinition == 'chevron-up') {
            // And if the parent's controller contains the advancedSearch service
            if (angular.isDefined(icon.$parent.$parent.$ctrl)) {
              var search_ctrl = icon.$parent.$parent.$ctrl;
              this.showLabel = angular.isDefined(search_ctrl.advancedSearchService);
            }
          }
        }
    }
}

AdvancedSearchChevronController.$inject = ['$scope'];

export let advancedSearchChevronComponent = {
  name: 'advanced-search-chevron',
  config: {
    bindings: { parentCtrl: '<' },
    controller: AdvancedSearchChevronController,
    template: '<chevron-label ng-if="$ctrl.showLabel"><span translate="nui.search-advanced.chevron"></span></chevron-label>',
  },
  enabled: false,
  appendTo: 'prm-icon-after',
  enableInView: '.*'
}  