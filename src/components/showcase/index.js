import showcaseHTML from './showcaseHTML.html'

class ShowcaseController {

    constructor($scope, $translate) {
        let self = this;
        self.$translate = $translate;
        this.$scope = $scope;
    }

    $onInit() {
        let self = this;
        let $scope = self.$scope;
        self.element = angular.element(document.querySelector("prm-showcase md-content md-card#Showcase md-card-content"));

        let watcher = self.$scope.$watch(() => {
            try {
              if (self.$translate.instant('nui.customization.showcase.url') == 'nui.customization.showcase.url') {
                return false;
              } else {
                return true;
              }
            } catch (e) {
              return false;
            }
        }, (n, o) => {
            if (n == true) {        
                 //url comes from the code table
                $scope.showcaseUrl = decodeURIComponent( self.$translate.instant( "nui.customization.showcase.url" ));

                var month = '0' + (new Date().getMonth() + 1).toString().slice(-2);
                var prev_month = '0' + (new Date().getMonth()).toString().slice(-2);
            
                var prev_date = new Date();
                prev_date.setMonth(prev_date.getMonth()-1);
                var prev_year= prev_date.getFullYear().toString().slice(-2);
                var year= new Date().getFullYear().toString().slice(-2);
            
                //might need changing for other with other views
                $scope.showcaseUrl = $scope.showcaseUrl.replace("2502", year + month);
                $scope.showcaseUrl = $scope.showcaseUrl.replace("2501", prev_year + prev_month);

                $scope.primoUrl = $scope.showcaseUrl;
                $scope.primoUrl = $scope.primoUrl.replace("q=", "query=");
                $scope.primoUrl = $scope.primoUrl.replace("/primaws/rest/external/pnxs", "/discovery/search");

                $scope.titleText = decodeURIComponent( self.$translate.instant( "nui.customization.showcase.titleText" ));
                
                //$scope.titleText = "Showcase"
                $scope.showcase_tmp = '<search-carousel titleLink="'+ $scope.primoUrl +'" titleText="'+ $scope.titleText +'" searchUrl='+ $scope.showcaseUrl +'></search-carousel>';
                self.element.append( $scope.showcase_tmp  );
                watcher();
            }
        })

       
    }
}

ShowcaseController.$inject = ['$scope','$translate'];

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