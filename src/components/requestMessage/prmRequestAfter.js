class RequestMessageController {


    constructor($templateCache, $translate) {
        let self = this;
        this.$templateCache = $templateCache;
        this.$translate = $translate;
    }

    $onInit() {
        let self = this;
        self.instituttion = window.appConfig.vid.split(":")[0];
        self.requestType = undefined;
        self.pickupInstitution = undefined;
        self.$ctrl = this.parentCtrl.parentCtrl;
        self.$ctrl.requestConsortiumFormDescription = 'almaRequest.formDescription';
        let template = 'components/search/fullView/getit/opac/request/request.html';
        self.$templateCache.put (template, self.$templateCache.get(template).replaceAll('$ctrl.requestFormDescription', '$ctrl.requestConsortiumFormDescription'));
    }

    $doCheck() {
        /*
        let template = 'components/search/fullView/getit/opac/request/request.html';
        this.$templateCache.put (template,   this.$templateCache.get(template).replaceAll('$ctrl.requestFormDescription', '$ctrl.requestConsortiumFormDescription'));
        */

        if ( this.$ctrl.requestService.ilsData) {

            this.requestType = this.$ctrl.requestService.ilsData["services-arr"].services[0].requestType[0]
            ///// requestType: "booking" {key: 'booking', value: 'almaRequest.requestType.booking'}
            ///// requestType: "hold"    {key: 'hold', value: 'almaRequest.requestType.hold'}

// console.log ( this.$translate.instant('nui.customization.almaBookingRequest.requestConsortiumFormDescription')  )

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

                    if (this.requestType.key == "booking"){
                        if ( this.$translate.instant('nui.customization.almaBookingRequest.requestConsortiumFormDescription.'+  this.pickupInstitution).replace(/[_\s]/g, "") != this.pickupInstitution.replace(/[_\s]/g, "") ) {
                            this.$ctrl.requestConsortiumFormDescription = 'nui.customization.almaBookingRequest.requestConsortiumFormDescription.'+  this.pickupInstitution;
                        }else{
                            if ( this.$translate.instant('nui.customization.almaBookingRequest.requestConsortiumFormDescription') != "requestConsortiumFormDescription" ) {
                                this.$ctrl.requestConsortiumFormDescription = 'nui.customization.almaBookingRequest.requestConsortiumFormDescription';
                            }
                        }
                    }


                    var label =  "almaRequest.genericCheckBox"
                    if ( this.$translate.instant('nui.customization.almaRequest.requestConsortiumgenericCheckBox.'+  this.pickupInstitution).replace(/[_\s]/g, "") != this.pickupInstitution.replace(/[_\s]/g, "") ) {
                        label = 'nui.customization.almaRequest.requestConsortiumgenericCheckBox.'+  this.pickupInstitution;
                    }else{
                        if ( this.$translate.instant('nui.customization.almaRequest.requestConsortiumgenericCheckBox') != "requestConsortiumgenericCheckBox" ) {
                            label = 'nui.customization.almaRequest.requestConsortiumGenericCheckBox';
                        }
                    }

                    var genericCheckBoxFormFieldIndex = this.$ctrl.form.findIndex((obj => obj.key == "genericCheckBox"))
                    if (genericCheckBoxFormFieldIndex) {
                        var genericCheckBoxFormField = this.$ctrl.form[genericCheckBoxFormFieldIndex]
                        genericCheckBoxFormField.options = genericCheckBoxFormField.options.map(function (option) {
                            if (  option.label == "almaRequest.genericCheckBox") {
                                option.label = label
                            }
                            return option
                        });

                    }

                }else{
                    this.$ctrl.requestConsortiumFormDescription = this.$ctrl.requestFormDescription;
                    if (this.requestType.key == "booking"){
                        this.$ctrl.requestConsortiumFormDescription = "nui.customization.almaBookingRequest.requestConsortiumFormDescription"
                    }
                }
            }else{
                this.$ctrl.requestConsortiumFormDescription = this.$ctrl.requestFormDescription;
                if (this.requestType.key == "booking"){
                        this.$ctrl.requestConsortiumFormDescription = "nui.customization.almaBookingRequest.requestConsortiumFormDescription"
                }
            }
           
           console.log ("requestConsortiumFormDescription:" + this.$ctrl.requestConsortiumFormDescription )
           console.log ("genericCheckBox label :" + label )

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
