import fullLocationsForBibliographicViewHTML from './fullLocationsForBibliographicView.html'

class fullLocationsForBibliographicViewController {

    constructor($element, $translate, $scope) {
        let self = this;
        this.$element = $element;
        this.$translate = $translate;
        this.$scope = $scope;
    }

    $onInit() {
        let self = this;
        self.vid = window.appConfig.vid;
        self.parentCtrl = this.parentCtrl.parentCtrl;
        self.item = this.parentCtrl.item;
        self.pnx = this.item.pnx;

        const library_filter_array = {
            'msb jesuit armarium': {
                "url": "https://kuleuven.limo.libis.be/permalink/32KUL_KUL/tuno99/" + self.pnx.control.recordid
                //"url": "https://" + document.location.host + "/primo-explore/fulldisplay?docid="+ this.pnx.control.recordid +"&context=L&vid=KULeuven&search_scope=ALL_CONTENT&isFrbr=true&tab=all_content_tab&noLogin=true"
            },
            'kadoc jesuit armarium': {
                "url": "https://kadoc.limo.libis.be/permalink/32KUL_KADOC/dtohan/" + self.pnx.control.recordid
                //"url": "https://" + document.location.host + "/primo-explore/fulldisplay?docid="+ this.pnx.control.recordid +"&context=L&vid=KADOC&search_scope=ALL_CONTENT&isFrbr=true&tab=all_content_tab"
            },
            'anet ruusbroec collection': {
                "url": "https://anet.be/record/uantwerpen/opacuantwerpen/" + self.pnx.control.sourcerecordid + "/N"
            }
        }


        self.delivery_library = self.pnx.display.lds10.map(lds10 => {
            var library_code = lds10.toLowerCase();
            lds10 = library_filter_array[library_code];
            lds10['name'] = this.$translate.instant(library_code);

            return lds10;
        });

        self.parentElement = self.$element.parent().parent()[0];

        let translatorWatcher = this.$scope.$watch(() => {
            return this.$translate.isReady()
        }, (n, o) => {
            if (n == true) {
                self.insertLocationsLinksSection()
                translatorWatcher();
            }
        }, false);
    }

    insertLocationsLinksSection() {
        console.log ("this.pnx:")
        console.log (this.pnx.display)

        
        if (typeof this.pnx.display.lds10 !== 'undefined' && this.pnx.display.lds10.length > 0) {
            let locationsLinksSectionData = {
                scrollId: "locationsLinks",
                serviceName: "locationsLinks",
                title: "nui.brief.results.tabs.LocationsLinks"
            };
            let locationsLinksSectionElement = this.$element //.find('locations-for-bibliographic-view')[0];
            this.insertSection(locationsLinksSectionData, locationsLinksSectionElement);
        }

    }

    insertSection(sectionData, sectionElement) {
        // The title of the new section is used to idenitfy the section
        // element.
        let sectionTitleSelector = 'h4[translate="' + sectionData.title + '"]';

        // We set up the watcher before inserting the section data,
        // to ensure that the watcher catches the change.
        this.waitForfullViewService(sectionData)
        this.waitForTargetThenMoveSection(sectionTitleSelector, sectionElement);
    }

    // Wait for the target element to be created.
    waitForTargetThenMoveSection(sectionTitleSelector, sectionElement) {
        let unbindWatcher = this.$scope.$watch(() =>
        this.parentElement.querySelector(sectionTitleSelector),
            (newVal, oldVal) => {
                if (newVal) {
                    this.moveSectionElement(newVal, sectionElement);
                    unbindWatcher();
                }
            }
        );
    }

    moveSectionElement(identifierElement, sectionElement) {
        let targetElement = identifierElement.parentElement.parentElement.parentElement.parentElement.children[1];
        // Move the section into the target element.
        if (targetElement && targetElement.appendChild) {
            targetElement.appendChild(sectionElement[0]);
        }
    }

    waitForfullViewService(sectionData) {
        let unbindWatcher = this.$scope.$watch(() =>
            this.parentCtrl.fullViewService.servicesArray,
            (newVal, oldVal) => {
                if (newVal) {
                    this.insertSectionData(sectionData);
                    // unbindWatcher();
                }
            }
        );
    }

    insertSectionData(sectionData) {
        Promise.resolve(this.parentCtrl.fullViewService.getServices(this.parentCtrl.item, this.parentCtrl.originator)).then(
            function (services) {
                // Add to services if not alread in the list
                //if ( services.findIndex(service => service.scrollId === "altmetrics") < 0 ){
                services.splice(services.length - 2, 0, sectionData);
                //}
            })

        // this.parentCtrl.services.splice(this.parentCtrl.services.length - 1, 0, sectionData);
    }
}

fullLocationsForBibliographicViewController.$inject = ['$element', '$translate', '$scope'];

export let fullLocationsForBibliographicViewConfig = {
    name: 'custom-locations-bibliographic-view',
    enabled: false,
    appendTo: 'prm-full-view-after',
    enableInView: '32KUL_KUL:JESUITS|32KUL_LIBIS_NETWORK:JESUITS_UNION',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: fullLocationsForBibliographicViewController,
        template: fullLocationsForBibliographicViewHTML
    }
}
