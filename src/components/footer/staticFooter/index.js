import './footer.css'

class StaticFooterController {
    constructor($scope) {
        let scope = $scope;
        var locale = scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() ||  "en";

        let vidDir = window.appConfig['vid'].replace(/:/,"-")
        scope.vidDir = vidDir

        var templateUrl = 'custom/'+ vidDir +'/html/footer/footer_' + locale + '.html';

        var http = new XMLHttpRequest();
        http.open('HEAD', templateUrl, false);
        http.send();
        if (http.status == 404) {
            templateUrl = 'custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/html/footer/footer_' + locale + '.html';
        }
        
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
