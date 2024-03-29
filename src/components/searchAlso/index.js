//facets.facet.facet_search_also
class SearchAlsoController {

  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    let self = this;
    let $scope = self.$scope;

    let facetService = this.parentCtrl.parentCtrl.facetService;
    let searchAsoWatcher = $scope.$watch(() => {
      return facetService.results;
    }, (n, o) => {
      if (facetService.results.filter(f => { return f.name == 'search_also' }).length == 0) {
        facetService.results.unshift({
          name: 'search_also',
          displayedType: 'exact',
          limitCount: 0,
          facetGroupCollapsed: false,
          values: undefined
        });
        //console.log('--------->SEEALSO count',facetService.results.filter(f => {return f.name == 'search_also'}).length);
        //searchAsoWatcher();
      }
    });

  }
}

SearchAlsoController.$inject = ['$scope'];


export let searchAlsoComponent = {
  name: 'custom-search-also',
  config: {
    bindings: { parentCtrl: '<' },
    controller: SearchAlsoController
  },
  enabled: true,
  appendTo: 'prm-facet-after',
    enableInView: '^32KUL_KATHO:VIVES|^32KUL_VLP:Archief|^32KUL_HUB:ODISEE|^FARO|^32KUL_KHK:TMOREK|^32KUL_KHM:TMOREMA|^32KUL_KHL:UCLL|^32KUL_KUL:KULeuven|^32KUL_LUCAWENK:LUCA|^32KUL_DOCVB:docvlaamsbrabant|^32KUL_VLER.*',
}