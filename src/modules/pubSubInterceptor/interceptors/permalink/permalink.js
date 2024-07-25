window.permalink = {
    active: true,
    activate: () => {
        permalink.active = true
    },
    init: (reqRes) => {
        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
    },
    configuration: {
        afterActionsBaseURL: [
            {
                enableInView: '32KUL_KUL:Lirias',
                replaceWithPnxField: 
                { 
                    field: "control.sourcerecordid",  
                    prefix: "https://lirias.kuleuven.be/"  
                }
            },
            {
                enableInView: '32KUL_KUL:(?!Lirias.*$).*$',
                replaceFieldForSource: 
                { 
                    source: 'Lirias_basic' ,
                    field: "control.originalsourceid",
                    prefix: "https://lib.is/_/"
                }
            },
            {
                enableInView: '32KUL_KADOC:.*TEST',
                replaceFieldForSource: 
                { 
                    source: 'KADOC_ScopeArchiv' ,
                    field: "control.originalsourceid",
                    prefix: "https://lib.is/_/"
                }
            }
        ]
    },
    replaceWithPnxField: ( { reqRes = {}, params = {} } = {} ) => {
        path = "config.data.pnx."+params.field
        reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);    
        reqRes.data.permalink = params.prefix + reqRes.data.permalink  
        return reqRes.data;
    },
    replaceFieldForSource: ( { reqRes = {}, params = {} } = {} ) => {
        if (reqRes.config.data.pnx.display.source.includes( params.source ) ) {
            path = "config.data.pnx."+ params.field
            reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);    
            [vid,sub_view] = reqRes.config.data.vid.split(':');
            reqRes.data.permalink = params.prefix + reqRes.data.permalink +":"+ vid +"."+ reqRes.config.data.search_scope +"."+ reqRes.config.data.tab +"."+ sub_view +"?";
        }
        return reqRes.data;
    }
};

pubSub.subscribe('after-actionsBaseURL', (reqRes) => {
    var actions = permalink.configuration.afterActionsBaseURL.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    if (actions.length > 0) {
        actions.forEach(action => {
            // console.log(action)
            Object.keys(action).forEach( a => {
                if (a !== "enableInView"){
                    try {
                        reqRes.data = permalink[a]({ reqRes: reqRes, params: action[a] });
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
        });
    }

    return reqRes;
});