(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);
/* https://otago.hosted.exlibrisgroup.com/primo-explore/search?vid=DUNEDIN&sortby=rank&search_scope=All */

/* TODO : get this on Central Package level */

app.component('prmUserAreaAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'prmUserAreaAfterController',
    templateUrl: 'custom/DOKS/html/user-area.html'
});

app.controller('prmUserAreaAfterController', ['$element', '$scope', '$location', '$templateCache', function ($element, $scope, $location, $templateCach) {

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
        angular.element(elementRemove.children[2]).remove();
        angular.element(elementRemove.children[1]).remove();
        angular.element(elementRemove.children[0]).remove();
        */
        $scope.signIn = function () {
            ctrl.parentCtrl.loginIframeService.loginService.handleLoginClick();
        };
    };
}]);
})();


import "../css/_index.css";