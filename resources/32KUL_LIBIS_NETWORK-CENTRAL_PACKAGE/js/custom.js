(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);
window.browzine = {
    api: "https://public-api.thirdiron.com/public/v1/libraries/1624",
    apiKey: "e71d1c31-7938-470a-8be2-a6e351e0c001",
    journalBrowZineWebLinkText: "View Journal Contents",
    articleBrowZineWebLinkText: "View Issue Contents",
    articlePDFDownloadLinkEnabled: true,
    articlePDFDownloadLinkText: "Download PDF",
    articleLinkEnabled: true,
    articleLinkText: "Read Article",
    unpaywallEmailAddressKey: "helpdesk@libisnet.be",
    articlePDFDownloadViaUnpaywallEnabled: true,
    articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)"
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
document.head.appendChild(browzine.script);

app.controller('prmSearchResultAvailabilityLineAfterController', function ($scope) {
    window.browzine.primo.searchResult($scope);
});

app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityLineAfterController'
});

app.component('prmServiceDetailsAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'prmServiceDetailsAfter',
    templateUrl: ''
});

app.controller('prmServiceDetailsAfter', ['$scope', '$compile', function ($scope, $compile) {
    self = this;
    this.$scope = $scope;
    this.$compile = $compile;

    self.removeDescriptionIfDb = function () {

        if (self.parentCtrl.item.pnx.display.type.includes("database")) {

            for (var d in self.parentCtrl.details) {
                if (self.parentCtrl.details[d].label === "description") {
                    self.parentCtrl.details[d].values[0].values = '';
                }
            }
        }
    };

    self.waitForPNX = function () {
        var _this = this;

        console.log(this);
        var unbindWatcher = self.$scope.$watch(function () {
            return self.parentCtrl.details;
        }, function (newVal, oldVal) {
            if (newVal) {
                unbindWatcher();
                _this.removeDescriptionIfDb();
            }
        });
    };

    self.waitForPNX();
}]);

/* https://otago.hosted.exlibrisgroup.com/primo-explore/search?vid=DUNEDIN&sortby=rank&search_scope=All */

/* document.title => See Code Table Header/Footer Tiles */
document.querySelectorAll("link[rel='icon']")[0].setAttribute("href", "/discovery/custom/49ECB_INST-ECB/img/favicon.png");

/* TODO : get this on Central Package level */

app.component('prmLinkedUserSelectorAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'prmLinkedUserSelectorAfter',
    templateUrl: '/discovery/custom/49ECB_INST-ECB/html/prmLinkedUserSelectorAfter.html'
});

app.controller('prmLinkedUserSelectorAfter', ['$element', '$scope', '$location', '$templateCache', function ($element, $scope, $location, $templateCach) {
    var ctrl = this;
    var scope = $scope;
    var vid = scope.$parent.$parent.$ctrl.vid;

    $scope.signOut = function () {
        scope.$root.$$childHead.$ctrl.userSessionManagerService.userLogout();
        //  document.location.href = "https://leuven-primo.hosted.exlibrisgroup.com/pds?func=logout&calling_system=primo&institute=ECB&url=" + document.location.origin + "/primo-explore/search?vid="+ vid +"%26performLogout=true"
    };
}]);

app.component('prmUserAreaAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'prmUserAreaAfterController',
    templateUrl: '/discovery/custom/49ECB_INST-ECB/html/user-area.html'
});

app.controller('prmUserAreaAfterController', ['$element', '$scope', '$location', '$templateCache', function ($element, $scope, $location, $templateCache) {

    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.$element = $element;
    };

    ctrl.$postLink = function () {
        ctrl.insertUserSignin();
    };

    ctrl.insertUserSignin = function () {
        var elementRemove = document.getElementsByTagName('prm-user-area')[0];
        var i = elementRemove.children.length - 1;
        while (i >= 0) {
            if (elementRemove.children[i].tagName !== 'PRM-USER-AREA-AFTER') {
                angular.element(elementRemove.children[i]).remove();
            }
            i--;
        }
        /*
        console.log (elementRemove) 
        angular.element(elementRemove.children[2]).remove();
        angular.element(elementRemove.children[1]).remove();
        angular.element(elementRemove.children[0]).remove();
        */
        $scope.signIn = function () {
            ctrl.parentCtrl.loginIframeService.loginService.handleLoginClick();
        };
    };
}]);

app.component('prmVirtualBrowseItemAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'prmVirtualBrowseItemAfter',
    templateUrl: ''
});

app.controller('prmVirtualBrowseItemAfter', ['$element', function ($element) {
    $element.parent().parent().attr("target", "_blank");
}]);
})();





