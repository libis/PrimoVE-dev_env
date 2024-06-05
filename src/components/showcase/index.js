class ShowcaseController {

    constructor($scope, $http, $translate, $rootScope) {
        var self = this;       
    }
     
    $onInit() {
        this.loadScript('../assets/js/discovery-showcase.bundled.js');
    }

}

ShowcaseController.$inject = ['$scope'];

export let showcaseComponent = {
    name: 'custom-showcase',
    enabled: true,
    appendTo: 'prm-static-after',
    enableInView: '32KUL_KUL:(KULeuven|REGIONAL).*',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: ShowcaseController
    }
}