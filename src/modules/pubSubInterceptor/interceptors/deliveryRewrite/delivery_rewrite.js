const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.deliveryRewrite = {
    active: true,
    activate: () => {
        deliveryRewrite.active = true
    },
    init: (reqRes) => {
        console.log(" INIT deliveryRewrite");
        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
        cloned_params['scope'] = 'lirias_profile';
        cloned_params['pcAvailability'] = true;
    }

};

//angular.module('deliveryRewrite', ['ng']).run(() => {
    document.addEventListener('pubSubInterceptorsReady', (e) => {
        pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {

            enableInView = '32KUL_KUL:Lirias';
            if (new RegExp(enableInView).test(window.appConfig.vid)) {
                reqRes.data.delivery.availability = reqRes.data.delivery.availability.filter(function (value, index, arr) {
                    return value !== "check_holdings";
                });
            }
            return reqRes;
        })
    });
//});