window.webhookTLevel = {
    active: true,
    activate: () => {
        webhookTLevel.active = true
    },
    init: (reqRes) => {
        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
    },
    renameFacet: ({ facets = {}, fromKey = "from", toKey = "to" } = {}) => {
        return facets.map(f => {
            if (f.name == fromKey) {
                f.name = toKey;
            };
            return f;
        })
    }
};


//angular.module('webhookTLevel', ['ng']).run(() => {
  //  document.addEventListener('pubSubInterceptorsReady', (e) => {
        // federated search and merge result set
pubSub.subscribe('after-pnxBaseURL', (reqRes) => {

            var enableInScopes ='lirias.*profile.*|Archief';
            if (new RegExp(enableInScopes).test( reqRes.config.params['scope'] )  )  {
                // process result 
                // FACETS
                let facets = reqRes.data.facets;
                if (facets) {
                    reqRes.data['facets'] = webhookTLevel.renameFacet({ facets: facets, fromKey: "lds_tlevel", toKey: "tlevel" });
                }

            }
            return reqRes;
        });
   // });
//});