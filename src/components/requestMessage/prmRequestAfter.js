class RequestMessageController {
s

    constructor($templateCache, $translate) {
        this.instituttion = window.appConfig.vid.split(":")[0];
        this.pickupInstitution = undefined;
        this.$ctrl = this.parentCtrl.parentCtrl;
        this.$translate = $translate;
        this.$ctrl.requestConsortiumFormDescription = 'almaRequest.formDescription';
        let template = 'components/search/fullView/getit/opac/request/request.html';
        $templateCache.put (template, $templateCache.get(template).replaceAll('$ctrl.requestFormDescription', '$ctrl.requestConsortiumFormDescription'));
    }

    $doCheck() {
        if ( this.$ctrl.requestService.ilsData) {
            this.pickupInstitution =  this.$ctrl.requestService.ilsData["services-arr"].services[0]["chosen-parameters-map"].pickupInstitution
            if (  this.pickupInstitution ) {
                if (  this.instituttion !== this.pickupInstitution) {
                    /*
                    console.log ( " this.pickupInstitution: [" +  this.pickupInstitution +"]")
                    console.log ( " this.$translation     : [" +  this.$translate.instant('nui.customization.almaRequest.requestConsortiumFormDescription.'+  this.pickupInstitution) +"]")
                    */
                    if ( this.$translate.instant('nui.customization.almaRequest.requestConsortiumFormDescription.'+  this.pickupInstitution).replace(/[_\s]/g, "") != this.pickupInstitution.replace(/[_\s]/g, "") ) {

                        this.$ctrl.requestConsortiumFormDescription = 'nui.customization.almaRequest.requestConsortiumFormDescription.'+  this.pickupInstitution;
                    }else{
                        if ( this.$translate.instant('nui.customization.almaRequest.requestConsortiumFormDescription') != "requestConsortiumFormDescription" ) {
                            this.$ctrl.requestConsortiumFormDescription = 'nui.customization.almaRequest.requestConsortiumFormDescription';
                        }
                    }
                }else{
                    this.$ctrl.requestConsortiumFormDescription = this.$ctrl.requestFormDescription;
                }
            }
            console.log ("requestConsortiumFormDescription:" + this.$ctrl.requestConsortiumFormDescription )

        }
    }
}

RequestMessageController.$inject = ['$templateCache', '$translate'];

export let requestMessagecomponent = {
    name: 'custom-request-message',
    enabled: true,
    appendTo: 'prm-request-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: RequestMessageController,
        template: ''
    }
}
