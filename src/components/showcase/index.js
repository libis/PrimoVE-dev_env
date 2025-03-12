import showcaseHTML from './showcaseHTML.html'

class ShowcaseController {

    constructor($scope, $translate,$http,$compile) {
         
        let self = this;
        self.$translate = $translate;
        self.$compile = $compile;
        this.$scope = $scope;
        //$scope.showcaseUrl = decodeURIComponent(self.$translate.instant( "nui.customization.showcase.url" ));
        
    }
     
    $onInit() {
        let self = this;
        let $scope = self.$scope;
      
        //url comes from the code table
        //$scope.showcaseUrl = decodeURIComponent("http://localhost:8003"+self.$translate.instant( "nui.customization.showcase.url" ));
        //use test url for now
        $scope.showcaseUrl = 'http://localhost:8003/primaws/rest/external/pnxs?acTriggered=false&blendFacetsSeparately=false&citationTrailFilterByAvailability=true&disableCache=false&getMore=0&inst=32KUL_BPB&isCDSearch=false&lang=en&limit=10&newspapersActive=false&newspapersSearch=false&offset=0&otbRanking=false&pcAvailability=true&q=any,contains,global&qExclude=&qInclude=&rapido=false&refEntryActive=false&rtaLinks=true&scope=MyInstitution&searchInFulltextUserSelection=true&skipDelivery=Y&sort=rank&tab=LibraryCatalog&vid=32KUL_BPB:BPB_TEST'; 
        

        //how it should look
        $scope.showcase = '<search-carousel titleText="Test showcase" searchUrl='+ $scope.showcaseUrl +'></search-carousel>';
      
    }
}

ShowcaseController.$inject = ['$scope','$translate','$http','$compile'];

export let showcaseComponent = {
    name: 'prm-showcase',
    enabled: true,
    appendTo: null,
    enableInView: '.*',
    config: {
        bindings: {
            parentCtrl: '<' ,
        },
        controller: ShowcaseController,
        template: showcaseHTML
    }
}