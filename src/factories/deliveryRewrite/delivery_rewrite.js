const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.deliveryRewrite = {
    active: true,
    activate: () => {
        let windowParams = window.location.search.slice(1).split('&').map(m => m.split('=')).reduce((map, obj) => { map[obj[0]] = obj[1]; return map }, {})
        if (windowParams.hasOwnProperty('blend')) {
            let active = windowParams.blend == 1;
            if (deliveryRewrite.active != active) {
                deliveryRewrite.active = active
                console.log('deliveryRewrite state change isActive:', deliveryRewrite.active);
            }
        }
    },
    init: (url, headers, params, data) => {

        console.log (" INIT deliveryRewrite");
        deliveryRewrite.set1.url = url;
        deliveryRewrite.set1.headers = headers;
        deliveryRewrite.set1.params = JSON.parse(JSON.stringify(params));
        deliveryRewrite.set1.data = data;

        deliveryRewrite.set2.url = url;
        deliveryRewrite.set2.headers = headers;
        deliveryRewrite.set2.data = {};

        let cloned_params = JSON.parse(JSON.stringify(params));
        cloned_params['scope'] = 'lirias_profile';
        cloned_params['pcAvailability'] = true;
        deliveryRewrite.set2.params = cloned_params;
    }
   
   
};

angular.module('deliveryRewrite', ['ng']).run(() => {
    // check appConfig.ts for restBaseURLsSuprima (webpack:///src/main/webapp/components/appConfig/appConfig.ts)
    /*
    pubSub.subscribe('after-ILSServicesBaseURL', (url, headers, params, data) => {
        console.log ('after-ILSServicesBaseURLl')
        console.log (data)
        return data;
    })
    */
    pubSub.subscribe('after-calculatePcDelivery', (url, headers, params, data) => {
        // console.log ('after-calculatePcDelivery')
        // console.log (data)
        enableInView = '32KUL_KUL:Lirias';
        if ( new RegExp(enableInView).test(window.appConfig.vid) ){ 
            data.delivery.availability = data.delivery.availability.filter(function(value, index, arr){ 
                return value !== "check_holdings";
            });
        }
        return data;
    })
   

});