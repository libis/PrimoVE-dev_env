const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.filterLinksService = {
    active: true,
    activate: () => {
        filterLinksService.active = true
    },
    init: (url, headers, params, data) => {
        let cloned_params = JSON.parse(JSON.stringify(params));
    },
    removelinks: ({ docs = {}, type = "backlink"}) => {
        return docs.map  (d => {
            delete d.pnx.links[type];
            return d
        });
    } 
};

angular.module('filterLinksService', ['ng']).run(() => {
    pubSub.subscribe('after-pnxBaseURL', (url, headers, params, data) => {
        enableInView = '32KUL_KUL:Lirias';
        if ( new RegExp(enableInView).test(window.appConfig.vid) ){ 
            if (data['docs']) {
                data['docs'] = filterLinksService.removelinks({docs:data['docs'], type:"backlink"});
            }
        }
        return data;
    })
});