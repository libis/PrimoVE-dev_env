const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.deliveryRewrite = {
    active: true,
    activate: () => {
        deliveryRewrite.active = true
    },
    init: (url, headers, params, data) => {
        console.log (" INIT deliveryRewrite");
        let cloned_params = JSON.parse(JSON.stringify(params));
        cloned_params['scope'] = 'lirias_profile';
        cloned_params['pcAvailability'] = true;
    }
  
};

angular.module('deliveryRewrite', ['ng']).run(() => {
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