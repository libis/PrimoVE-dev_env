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
                replaceWithPnxField: { field: "control.sourcerecordid" },
                prefixLink: { prefix: "https://lirias.kuleuven.be/" }
            }
        ]
    },
    replaceWithPnxField: ( { reqRes = {}, params = {} } = {} ) => {
        path = "config.data.pnx."+params.field
        reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);     
        return reqRes.data;
    },
    prefixLink: ( { reqRes = {}, params = {} } = {} ) => {
        reqRes.data.permalink = params.prefix + reqRes.data.permalink 
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