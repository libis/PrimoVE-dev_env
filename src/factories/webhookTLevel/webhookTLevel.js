const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.webhookTLevel = {
    active: true,
    activate: () => {
        webhookTLevel.active = true
    },
    init: (url, headers, params, data) => {
        let cloned_params = JSON.parse(JSON.stringify(params));
    },
    renameFacet: ({ facets = {}, fromKey = "from", toKey = "to" } = {}) => {
        return facets.map (f => {
             if (f.name == fromKey){
                f.name = toKey;
             };
             return f;
        })
    }
};

angular.module('webhookTLevel', ['ng']).run(() => {
    // federated search and merge result set
    pubSub.subscribe('after-pnxBaseURL', (url, headers, params, data) => {
        if (params['scope'] == 'lirias_profile') {
            // process result 
            // FACETS
            let facets = data.facets;
            if (facets) {
                data['facets'] = webhookTLevel.renameFacet({facets:facets, fromKey:"lds_tlevel", toKey:"tlevel"});
            }

        }
        return data;
    });
});