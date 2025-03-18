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

        console.log(self.element);

        //url comes from the code table
        $scope.showcaseUrl = decodeURIComponent("http://localhost:8003"+self.$translate.instant( "nui.customization.showcase.url" ));

        var month = '0' + (new Date().getMonth() + 1).toString().slice(-2);
        var year= new Date().getFullYear().toString();
        //todo - replace or add date in url
        
        $scope.titleText = decodeURIComponent( self.$translate.instant( "nui.customization.showcase.titleText" ));
        // use test titleText for now

        //$scope.titleText = "Showcase"
        $scope.showcase_tmp = '<search-carousel titleText="'+ $scope.titleText +'" searchUrl='+ $scope.showcaseUrl +'></search-carousel>';
        self.element.append( $scope.showcase_tmp  );
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