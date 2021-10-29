class StaticFooterController {
    constructor($scope) {
        let scope = $scope;
        var locale = scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() ||  "en";

        let vidDir = window.appConfig['vid'].replace(/:/,"-")
        scope.vidDir = vidDir

        var templateUrl = 'custom/'+ vidDir +'/html/templates/footer_' + locale + '.html';

        $scope.getTemplateUrl = function () {
            return templateUrl;
        }
    }
}

StaticFooterController.$inject = ['$scope'];

export let StaticFooterConfig = {
    name: 'custom-static-footer',
    enabled: true,
    appendTo: 'prm-explore-footer-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: StaticFooterController,
        template: '<ng-include src="getTemplateUrl()"/>',
    }
}
