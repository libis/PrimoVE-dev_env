import externalLinkingHTML from './externalLinking.html'
import externalLinkingCSS from './externalLinking.css'

class ExternalLinkingController {
    constructor($scope, $element) {
        self = this
        this.$scope = $scope;
    }     
}
ExternalLinkingController.$inject = ['$scope', '$element'];

export let externalLinkingcomponent = {
    name: 'prm-external-linking',
    enabled: true,
    appendTo: '',
    enableInView: '.*',
    config: {
        bindings: {
            value: '<',
            curValue: '<',
            parentCtrl: '<'
        },
        controller: ExternalLinkingController,
        template: externalLinkingHTML
    }
}
