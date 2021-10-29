class LibInfoContainerLocationController {
    constructor($element, $scope, $compile) {
        this.element = $element;
        this.scope = $scope;
        this.compile = $compile;
    }

    $doCheck() {
        let locationEl = angular.element(this.element.parent().parent());
        if (locationEl && locationEl.find('custom-lib-info').length == 0) {
            let placeHolder = locationEl[0].querySelector('div.list-item-actions');
            if (placeHolder) {
                this.location = this.parentCtrl.parentCtrl.loc.location;

                let el = document.createElement('custom-lib-info');
                el.setAttribute('location', '$ctrl.location');
                el.setAttribute('library', this.location.libraryCode);

                placeHolder.insertBefore(el, null);
                this.compile(placeHolder)(this.scope);
            }
        }

        let locationItemEl = angular.element(document.querySelector('prm-location-items'));
        if (locationItemEl) {
            let placeHolder2 = locationItemEl[0].querySelector('div.tab-content-header > div.layout-row > div');
            if (placeHolder2) {
                let locationItemsController = locationItemEl.controller('prm-location-items')
                if (locationItemsController) {

                    let currLoc = locationItemsController.currLoc;
                    if (currLoc != undefined) {
                        this.locationItem = currLoc.location;
                        if (locationItemEl.find('custom-lib-info').length == 0) {
                            let el2 = document.createElement('custom-lib-info');
                            el2.setAttribute('location', '$ctrl.locationItem');

                            placeHolder2.insertBefore(el2, null);
                            this.compile(placeHolder2)(this.scope);
                        }
                    }
                }
            }
        }
    }
}

LibInfoContainerLocationController.$inject = ['$element', '$scope', '$compile'];

export let libInfoContainerLocationComponent = {
    name: 'custom-lib-location-info-container',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: LibInfoContainerLocationController,
        template: ''
        //template: '<custom-lib-info location="$ctrl.location"></custom-lib-info>'
    },
    enabled: false,
    appendTo: 'prm-location-after',
    enableInView: '.*',
}