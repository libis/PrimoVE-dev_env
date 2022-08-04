
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

        window.fullViewServiceOrder = [];
        
        self.appendToElement = document.getElementsByTagName("primo-explore")[0];

        self.servicesOrder = self.parentCtrl.parentCtrl.fullViewService.configurationUtil.getBriefResultConfiguration().tabsorder.items.split(',');
        // brief-section always on top 
        self.servicesOrder.unshift('brief')
        
        // citationTrails-section aways after brief
        self.servicesOrder.splice(self.servicesOrder.indexOf('brief'), 1, 'brief', 'citationTrails')
        
        // action_list-section (send-to) aways before details
        self.servicesOrder.splice(self.servicesOrder.indexOf('details'), 1, 'action_list', 'details')

        // action_list-section (send-to) aways after links-section
        // self.servicesOrder.splice(self.servicesOrder.indexOf('links'), 1, 'links', 'action_list')
        let services_keys = Object.keys(self.parentCtrl.parentCtrl.fullViewService.servicesDirectives);
        //let difference = services_keys.filter(s => !self.servicesOrder.includes(s));
        self.servicesOrder = self.servicesOrder.concat(services_keys.filter(s => !self.servicesOrder.includes(s)));

        if (self.parentCtrl.parentCtrl.$stateParams.vid === "32KUL_KUL:Lirias") {
            self.servicesOrder = ["brief", "getit_link1", "details", "links", "altmetrics", "action_list", "tags", "citationTrails"];
        }
        if (self.parentCtrl.parentCtrl.$stateParams.vid === "32KUL_KUL:JESUITS" ||
            self.parentCtrl.parentCtrl.$stateParams.vid === "32KUL_LIBIS_NETWORK:JESUITS_UNION" 
        ) {
            self.servicesOrder = ["brief", "details", "getit_link1", "links", "altmetrics", "action_list", "tags", "citationTrails"];
        }
        let translatorWatcher = $scope.$watch(() => {
            return self.$translate.isReady()
        }, (n, o) => {
            if (n == true) {

                services_keys.forEach(function (service_key) {
                    var service = self.parentCtrl.parentCtrl.fullViewService.servicesDirectives[service_key];
                    var orderId = service["scrollId"]
                    if (orderId){
                        var order = self.servicesOrder.indexOf(orderId);
                        if (order < 0) { 
                            order = 50
                        }
                        self.addStyle(order,service)
                    }
                });

                let servicesWatcher = $scope.$watch(() => {
                    let servicesLoaded = self.parentCtrl.parentCtrl.fullViewService.servicesArray !== undefined;
                    let calculatePrimaViewItDone = self.parentCtrl.parentCtrl.fullViewService.calculatePrimaViewItDone();
                    let calculatePcDeliveryDone = self.parentCtrl.parentCtrl.fullViewService.calculatePcDeliveryDone;
                    let calculateSvcIdDone = self.parentCtrl.parentCtrl.fullViewService.calculateSvcIdDone;
                    return (servicesLoaded && calculatePrimaViewItDone && calculatePcDeliveryDone && calculateSvcIdDone);
                }, (n, o) => {
                    if (n == true) {
                        self.addStyles(self)
                        servicesWatcher(); //deregister watcher
                    }
                }, false);
                translatorWatcher();
            }
        }, false);

    }

    addStyles() {
        var self = this

        self.parentCtrl.parentCtrl.fullViewService.servicesArray.forEach(function (service) {
            var orderId = service["scrollId"].replace(/getit_link1.*/, 'getit_link1').replace(/getit_link2.*/, 'getit_link2')
            var styleId = 'style_' + service["scrollId"]
            var order = self.servicesOrder.indexOf(orderId);
/*
            console.log (styleId)
            console.log (service)
*/
            if (order < 0) {
                console.warn("Service ["+ service.serviceName +"] not found in servicesOrder");
                order = 50;
            }

            self.addStyle(order,service)

        });

    }

    addStyle(order,service) {
        var self = this

        var styleId = 'style_' + service["scrollId"]
        if ( window.fullViewServiceOrder.includes(styleId) ) {
            return;
        }
        window.fullViewServiceOrder.push(styleId);

        if ( self.appendToElement.querySelector('style#' + styleId)) {
            //next 
            return;
        }

        var s = document.createElement("style");
        s.setAttribute("id", styleId);
        s.innerHTML = ""
        s.innerHTML += "div#services-index button[aria-label=\"" + self.$translate.instant(service["title"]) + "\"] { order: " + order + " !important;}";
        s.innerHTML += "div#services-index button[aria-label=\"" +service["title"] + "\"] { order: " + order + " !important;}";
        s.innerHTML += "div.full-view-section#" + service["scrollId"] + " { order: " + order + " !important;}";

        self.appendToElement.appendChild(s);
    }
}

SectionOrderController.$inject = ['$scope', '$element', '$translate', '$rootScope'];

export let sectionOrderConfig = {
    name: 'custom-section-visibility-order',
    enabled: true,
    appendTo: 'prm-full-view-after',
    enableInView: '.*',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: SectionOrderController,
        template: ''
    }
}