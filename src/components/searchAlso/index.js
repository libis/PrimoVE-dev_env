//facets.facet.facet_search_also
class SearchAlsoController {
    constructor($scope){
      let facetService = this.parentCtrl.parentCtrl.facetService;
      let searchAsoWatcher = $scope.$watch(() => {        
          return facetService.results;
      }, (n,o) => {          
          if (facetService.results.filter(f => {return f.name == 'search_also'}).length == 0) {            
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
      bindings:{parentCtrl:'<'},
      controller: SearchAlsoController
    },
    enabled: false,
    appendTo: 'prm-facet-after',
    enableInView: '.*'
  }