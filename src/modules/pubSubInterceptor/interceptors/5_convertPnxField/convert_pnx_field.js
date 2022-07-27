window.convertPnxField = {
    active: true,
    configuration: {
        afterPnxBaseURL: [
            {
                enableInView: '32KUL_KUL:Lirias',
                convertPnxField: { source_target_list: [ { type: "override", source: "display.lds07", target: "display.type" } ] }
            }
        ]
    },
    activate: () => {
        convertPnxField.active = true
    },
    /*
    init: (url, headers, params, data, $translate) => {
        console.log ("-----> init links_service_rewrite")
       // console.log ( $translate.instant('nui.customization.browzine.apikey')  )
        let cloned_params = JSON.parse(JSON.stringify(params));
    },
    */
    getPnxFieldValue: (path, obj) => {
        return path.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : null
        }, obj || self)
    },
    setPnxFieldValue: (path, value, obj) => {
        var i;
        path = path.split('.');
        for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];
        obj[path[i]] = value;
    },
    convertPnxField: ({ doc = {}, source_target_list = [] }) => {
        if (doc.pnx) {
            source_target_list.forEach( source_target => {
                if (source_target.type === "override"){
                    convertPnxField.setPnxFieldValue (source_target.target, convertPnxField.getPnxFieldValue(source_target.source, doc.pnx), doc.pnx )
                }

            })
        }
        return doc;
    },
};


pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    // "convertPnxField".init(url, headers, params, $translate);
    var rewriteActions = convertPnxField.configuration.afterPnxBaseURL.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    if (rewriteActions.length > 0) {
        rewriteActions.forEach(rewriteAction => {

            delete rewriteAction.enableInView;
            // console.log(rewriteAction);

            Object.entries(rewriteAction).forEach(ra => {
                const [action, parameters] = ra;
                console.log(action);
                console.log(parameters);                
                // console.log (reqRes.data)

                // pnxBaseURL is also called for fullview (Permalink)
                // the url than starts with /primaws/rest/pub/pnxs/L/ instead of /primaws/rest/pub/pnxs
                // the url than starts with /primaws/rest/pub/pnxs/SearchWebhook/ instead of /primaws/rest/pub/pnxs
                if (reqRes.data['docs']) {
                    reqRes.data['docs'].map(d => {
                        parameters.doc = d
                       
                        try {
                            d = convertPnxField[action](parameters);
                        } catch (error) {
                            console.error(error);
                        }
                        return d
                    });
                }
                if (reqRes.data['pnx']) {
                    parameters.doc = reqRes.data
                    try {
                        reqRes.data = convertPnxField[action](parameters);
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        });
    }
    return reqRes;
});