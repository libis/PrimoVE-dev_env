class LibInfoSeedController {
    constructor($scope, $element, $compile, $timeout) {
        let self = this;
        let divs = $element.parent().parent().find('div')

        self.element = $element;
        self.scope = $scope;
        self.compile = $compile;
        self.timeout = $timeout;
        self.parentEl = divs[0];

    }
  
    #addLibraryInfo() {
        let self = this;

        let libraryElements = Primo.record.current.library.allAsElement;
        if (libraryElements) {
            libraryElements.forEach((el, i, a) => {
                let selector = 'prm-stack-map';
                //self.addChevron(el)
                if (el.query(selector) && !el.query('custom-lib-info')) {
                    let libraryCode = Primo.record.current.library.all[i].lib.split(':')[0];
                    self.addLibInfo(el.query(selector)[0], i, libraryCode, 'library');
                }
            });
        }
    }

    #addLocationInfo() {
        let self = this;        
        if (Primo.record.current.location.elementVisible()) {
            let locationElements = Primo.record.current.location.allAsElement;
            if (locationElements && (locationElements.length != document.querySelectorAll('prm-location custom-lib-info').length)) {
                locationElements.forEach((el, i, a) => {
                    let selector = 'prm-stack-map';
                    if (!el.query(selector)) {                        
                        selector = 'div > div.layout-row > div';//fallback selector
                    }

                    if (el.query(selector) && !el.query('custom-lib-info')) {
                        let libraryCode = Primo.record.current.location.all[i].loc.location.libraryCode;
                        self.addLibInfo(el.query(selector)[0], i, libraryCode, 'location');
                    }
                });
            }
        }
    }

    #addItemInfo() {
        let self = this;
        if (Primo.record.current.location.item.elementVisible()) {
            if (Primo.record.current.location.item.allAsElement) {
                Primo.record.current.location.item.allAsElement.forEach((el, i, a) => {   
                    let selector = 'prm-stack-map';
                    if (!el.query(selector)) {
                        selector = 'div > div.layout-row > div';//fallback selector
                    }                    
                    if (el.query(selector) && !el.query('custom-lib-info')) {
                        let libraryCode = Primo.record.current.location.item.all[i].loc.location.libraryCode;
                        
                        self.addLibInfo(el.query(selector)[0], i, libraryCode, 'item-location');
                    }
                });
            }
        }
    }

    $onInit() {
        let self = this;
        let libraryWatcher = self.scope.$watch(() => {
            let el = document.querySelector('prm-library h3');
            if (el) {
                return !(window.getComputedStyle(el).visibility == 'hidden');
            }
            return false;
        }, (n, o) => {
            if (n == true) {
                try {
                    console.log("trigger libary for:", Primo.record.current.library.allAsElement)

                    Primo.record.current.library.allAsElement.map((m) => {
                        if (m.query('custom-lib-info')) {
                            console.log("\tUpdating current library");
                            m.query('custom-lib-info')[0].remove()
                        }
                    })
                } catch (e) {
                    console.log(e);
                }

                self.timeout(() => self.#addLibraryInfo());
                //libraryWatcher();
            }
        })


        let locationWatcher = self.scope.$watch(() => {
            let el = document.querySelector('prm-location h3');
            if (el) {
                return !(window.getComputedStyle(el).visibility == 'hidden' && el.length != document.querySelectorAll('prm-location custom-lib-info'));
            }
            
            return false;
        }, (n, o) => {
            if (n == true) {
                try {
                    console.log("trigger location for:", Primo.record.current.location.allAsElement)
                    Primo.record.current.location.allAsElement.map((m) => {
                        if (m.query('custom-lib-info')) {
                            console.log("\tUpdating current location");
                            m.query('custom-lib-info')[0].remove()
                        }
                    })
                } catch (e) {
                    console.log(e);
                }

                self.timeout(() => self.#addLocationInfo());
                //locationWatcher();
            }
        })

        let itemWatcher = self.scope.$watch(() => {
            let el = document.querySelector('prm-location-items h6');
            if (el) {
                return !(window.getComputedStyle(el).visibility == 'hidden');
            }

            return false
        }, (n, o) => {
            if (n == true) {
                try {
                    console.log("trigger item for:", Primo.record.current.location.item.allAsElement)
                    Primo.record.current.location.item.allAsElement.map((m) => {
                        if (m.query('custom-lib-info')) {
                            console.log("\tUpdating current items");
                            m.query('custom-lib-info')[0].remove()
                        }
                    })
                } catch (e) {
                    console.log(e);
                }

                self.timeout(() => self.#addItemInfo());
                //itemWatcher();
            }
        })


    }

    addLibInfo(el, index, libraryCode, type) {
        let self = this;
        if (el && !el.querySelector('custom-lib-info') && libraryCode) {
            if (libraryCode != undefined) {
                let elInfo = document.createElement('custom-lib-info');
                elInfo.setAttribute('code', libraryCode);
                elInfo.setAttribute('index', index);
                elInfo.setAttribute('type', type);

                let $elInfo = angular.element(elInfo);
                let compiledElInfo = self.compile($elInfo);

                //add new scope
                compiledElInfo(self.scope.$parent.$new());
                el.append(elInfo);
            }
        }
    }

    addChevron(appendEl) {
        let self = this;

        if (!appendEl.query("prm-icon[name='chevron']")) {
            let el = document.createElement('prm-icon');
            el.setAttribute('name', 'chevron');
            el.setAttribute('icon-type', 'svg');
            el.setAttribute('svg-icon-set', 'hardware');
            el.setAttribute('icon-definition', 'ic_keyboard_arrow_right_24px');

            //reference new element as an angularjs element
            let $el = angular.element(el);
            //compile 
            let compiledEl = self.compile($el);
            //add new scope
            compiledEl(self.scope.$parent.$new());
            appendEl.query('div > div').append(el);
        }
    }
}

LibInfoSeedController.$inject = ['$scope', '$element', '$compile', '$timeout'];

export let libInfoSeedComponent = {
    name: 'custom-seed-lib-info',
    config: {
        bindings: { parentCtrl: '<' },
        controller: LibInfoSeedController,
        template: ''
    },
    enabled: true,
    appendTo: 'prm-full-view-after',
    enableInView: '.*'
}