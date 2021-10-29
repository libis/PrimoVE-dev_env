import User from "../../primo/user";

class DotTestController {
    constructor($ocLazyLoad,$injector) {
        console.log('constructor');
    }
}

DotTestController.$inject = ['$ocLazyLoad','$injector']

export let dotTestComponent = {
    name: 'custom-dot-test',
    config: {
        bindings: {parentCtrl: '<'},
        controller: DotTestController,
        template: "<div style='position:fixed;right: 0;top: 0;color:#009991;opacity:0.5;z-index: 100000;font-size: 10em;'>.</div>"
    },
    enabled: false,
    appendTo: 'prm-top-bar-before',
    enableInView: '.*'
}