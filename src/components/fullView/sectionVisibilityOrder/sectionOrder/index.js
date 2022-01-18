
/*
De WG Limo wil dezelfde volgorde van de secties behouden als in de huidige Limo.
DWZ onderstaande. Dit is zo geconfigureerd in de view van KU Leuven, behalve Send To en Altmetrics, die niet in de configuratie zitten.
----------------------------
(Search within Journal: te verbergen)
Citations
Getit / View Online (getit_link1)
Links
*Send To: *: zou hier tussen moeten staan maar zit niet in de configuratie
Details
recommendations ???
More of the same
Browseshelf (nieuw, niet zeker of dat gebruitkt gaat worden)
(QuickAccess: nieuw, momenteel niet actief)
Tags ???
Altmetrics: zit niet in de configuratie


Order "32KUL_KUL:Lirias":
----------------------------
View Online
Details
Links
altmetrics
Send to
Tags
Citations
*/

class SectionOrderController {
    constructor($scope, $element, $translate, $rootScope) {
        var self = this
        self.$scope = $scope;
        self.$element = $element;
        self.$translate = $translate;

        let translatorWatcher = $scope.$watch(() => {
            return self.$translate.isReady()
        }, (n, o) => {
            if (n == true) {
                let servicesWatcher = $scope.$watch(() => {
                    let servicesLoaded = self.parentCtrl.parentCtrl.fullViewService.servicesArray !== undefined;
                    let calculatePrimaViewItDone = self.parentCtrl.parentCtrl.fullViewService.calculatePrimaViewItDone()
                    return (servicesLoaded && calculatePrimaViewItDone);
                }, (n, o) => {
                    if (n == true) {
                        self.addStyles(self)
                        servicesWatcher(); //deregister watcher
                    }
                }, false);
                translatorWatcher();
            }
        }, false);

        /*
            if (serviceName === 'display') {
                this.viewOnlineScrollId = 'getit_link1_' + scrollIdIndex;
            }
            array.push(
                {
                    scrollId: 'getit_link1_' + scrollIdIndex,
                    serviceName: serviceName,
                    title: 'nui.getit.' + value.links[0].getItTabText,
                    linkElement: value
                }
            );
        
        
              'brief': {
                        scrollId: 'brief',
                        serviceName: 'brief',
                        title: 'nui.brief.results.tabs.brief'
                    },
                    'citations': {
                        scrollId: 'citationTrails',
                        serviceName: 'citationTrails',
                        title: 'citation_trail.link.citations',
                        conditional: (item: PrimoResponse.IDoc) => {
                            return (this.recordUtil.hasCitationTrails(item) && this.citationTrailsFullviewLinkService.shouldDisplayCitationTrial()) || this.citationTrailsFullviewLinkService.shouldDisplayTimesCited();
                        }
                    },
                    'action_list': {
                        scrollId: 'action_list',
                        serviceName: 'action_list',
                        title: 'nui.brief.results.tabs.send_to'
                    },
                    'esploroUsage': {
                        scrollId: 'esploroUsage',
                        serviceName: 'esploroUsage',
                        title: 'nui.brief.results.tabs.esploroUsage'
                    },
                    'getit_link2': {
                        serviceName: 'getit_link2', title: 'Get it 2'
                    },
                    'getit_link1': {
                        scrollId: 'getit_link1',
                        serviceName: 'getit_link1',
                        title: 'brief.results.tabs.locations'
                    },
                    'tags': {
                        scrollId: 'tags',
                        serviceName: 'tags',
                        title: 'brief.results.tabs.tags'
                    },
                    'rapidoOffer': {
                        scrollId: 'rapidoOffer',
                        serviceName: 'rapidoOffer',
                        title: 'brief.results.tabs.Get_it_from_other_locations'
                    },
                    'quickAccess': {
                        scrollId: 'quickAccess',
                        serviceName: 'quickaccess',
                        title: 'nui.brief.results.tabs.quickAccess'
                    },
                    'details': {
                        scrollId: 'details',
                        serviceName: 'details',
                        title: 'brief.results.tabs.details'
                    },
                    'links': {
                        scrollId: 'links',
                        serviceName: 'links',
                        title: 'nui.brief.results.tabs.links'
                    },
                    'browseshelf': {
                        scrollId: 'virtualBrowse',
                        serviceName: 'virtualBrowse',
                        title: 'brief.results.tabs.browseshelf'
                    },
                    'moreLikeThisCourse': {
                        scrollId: 'moreFromTheSameCourse',
                        serviceName: 'moreLikeThisCourse',
                        title: 'nui.brief.results.tabs.courseTab',
                        tabTitle: 'nui.brief.results.tabs.moreCourse',
                        conditional: (item: PrimoResponse.IDoc) => {
                            return getAttributesMap().moreLikeCourse ? getAttributesMap().moreLikeCourse : false;
                        }
                    },
                    'moreLikeThisCollection': {
                        scrollId: 'moreFromTheSameCollection',
                        serviceName: 'moreLikeThisCollection',
                        title: 'nui.brief.results.tabs.collectionTab',
                        tabTitle: 'nui.brief.results.tabs.moreCollection',
                        conditional: (item: PrimoResponse.IDoc) => {
                            return getAttributesMap().moreLikeCollection ? getAttributesMap().moreLikeCollection : false;
                        }
                    },
                    'searchWithinJournal': {
                        scrollId: 'searchWithinJournal',
                        serviceName: 'searchWithinJournal',
                        title: 'brief.results.tabs.searchWithinJournal'
                    }, 
                    'timesCited': {
                        scrollId: 'citationTrails',
                        serviceName: 'timesCited',
                        title: 'citation_trail.link.citations',
                        conditional: (item: PrimoResponse.IDoc) => {
                            return this.timesCitedService.shouldDisplayTimesCited;
                        }
                    },
                    'mayAlsoBeFoundAt': {
                        scrollId: 'mayAlsoBeFoundAt',
                        serviceName: 'mayAlsoBeFoundAt',
                        title: 'nui.brief.results.tabs.mayAlsoBeHeldByTab',
                        tabTitle: 'nui.brief.results.tabs.mayAlsoBeFoundAt',
                        conditional: (item: PrimoResponse.IDoc) => {
                            return getAttributesMap().mayAlsoBeHeldByEnabled ? getAttributesMap().mayAlsoBeHeldByEnabled : false;
                        }
                    }
        //                                        'reviewsandtags'  : {'<prm-customization-iframe url-template-id="fullViewUrl"></prm-customization-iframe>'},
        
        //                    'recommendations': {},
        //                    'citations': {},
        //                    'onlinereviews': {},
        //                    'browseshelf': {}
        
        */


    }

    addStyles() {
        var self = this

        var appendToElement = document.getElementsByTagName("primo-explore")[0];

        let servicesOrder = self.parentCtrl.parentCtrl.fullViewService.configurationUtil.getBriefResultConfiguration().tabsorder.items.split(',');
        // brief-section always on top 
        servicesOrder.unshift('brief')
        // citationTrails-section aways after brief
        servicesOrder.splice(servicesOrder.indexOf('brief'), 1, 'brief', 'citationTrails')
        // action_list-section (send-to) aways after links-section
        servicesOrder.splice(servicesOrder.indexOf('links'), 1, 'links', 'action_list')

        let services_keys = Object.keys(self.parentCtrl.parentCtrl.fullViewService.servicesDirectives);
        //let difference = services_keys.filter(s => !servicesOrder.includes(s));
        servicesOrder = servicesOrder.concat(services_keys.filter(s => !servicesOrder.includes(s)));

        // 
        if (self.parentCtrl.parentCtrl.$stateParams.vid === "32KUL_KUL:Lirias") {
            servicesOrder = ["brief", "getit_link1", "details", "links", "altmetrics", "action_list", "tags", "citationTrails"];
        }

        // console.log(servicesOrder)
        self.parentCtrl.parentCtrl.fullViewService.servicesArray.forEach(function (service) {
            var orderId = service["scrollId"].replace(/getit_link1.*/, 'getit_link1').replace(/getit_link2.*/, 'getit_link2')
            var styleId = 'style_' + service["scrollId"]
            var order = servicesOrder.indexOf(orderId);

            /*
            console.log (styleId)
            console.log (service)
            */
            if (appendToElement.querySelector('style#' + styleId)) {
                //next 
                return;
            }

            if (order < 0) {
                console.warn("Service not found in servicesOrder");
                console.log(service);
                order = 50;
            }

            order++;

            var s = document.createElement("style");
            s.setAttribute("id", styleId);
            s.innerHTML = ""
            s.innerHTML += "div#services-index button[aria-label=\"" + self.$translate.instant(service["title"]) + "\"] { order: " + order + " !important;}";
            s.innerHTML += "div.full-view-section#" + service["scrollId"] + " { order: " + order + " !important;}";

            appendToElement.appendChild(s);

        });

    }
}

SectionOrderController.$inject = ['$scope', '$element', '$translate', '$rootScope'];

export let sectionOrderConfig = {
    name: 'custom-section-visibility-order',
    enabled: true,
    appendTo: 'prm-full-view-after',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: SectionOrderController,
        template: ''
    }
}