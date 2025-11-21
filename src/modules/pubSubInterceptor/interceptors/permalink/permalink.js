/*
pnx contains parameter for source system and source ID

               | control.sourceid | control.sourcesystem | display.source
Alma           | "alma"           | ["ILS"]              | ["Alma"]
CDI            | ["gale_plos_...  | ["Other"]            | ["DOAJ... 
Parochiebl...  | "alma"           | ["ROSETTA_OAI_DC1"]  | ["Alma"]
Trajecta       | "alma"           | ["Other"]            | ["Trajecta"]  
Lirias_basic   | "alma"           | ["Other"]            | ["Lirias_basic"]
RUUSBROEC_ANET | "alma"           | ["Other"]            | ["RUUSBROEC_ANET"]
ODIS           | "alma"           | ["Other"]            | ["ODIS_organisations"]
ScopeArchiv    | "alma"           | ["Other"]            | ["KADOC_ScopeArchiv"]
Lirias         | "lirias"         | ["Webhook"]          | ["lirias"]


There are two variants of the permalink:
1. The general LIBIS permalink, used for all regular Limo records (Alma + Discovery import)
2. The Lirias permalink, used for Lirias Searchwebhook records

The following logic allows to add the correct prefix, format, and source fields for the permalinks:

1. If sourcesystem is not Webhook, apply variant of the LIBIS permalink = prefix 'lib.is'
    a. If sourceid is not 'alma', the record is a CDI record => use recordid
    b. If source is alma, the record is an Alma record or a Discovery import record => use lds12
2. If source system is Webhook, apply specialized URL (currently only Lirias). To make the code more future proof, filter on sourceid
    a. if source ID is 'lirias' => use prefix 'lirias.kuleuven.be' and field 'sourcerecordid'

*/


window.permalink = {
    active: true,
    activate: () => {
        permalink.active = true
    },
    init: (reqRes) => {
        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
    },
    configuration: {
        linkMap: require('./permalink_map.json'),
        afterActionsBaseURL: [
            {
                enableInView: '32KUL_.*$',
                replaceFieldForSourceSystem:
                {
                    sourcesystem: new RegExp('^(?!Webhook)'),
                    sourceid: new RegExp('^(?!alma)'),  // sourcid voor cdi records is niet alma
                    field: "control.recordid",
                    prefix: "https://lib.is/_/"
                }
            },
            {
                enableInView: '32KUL_.*$',
                replaceFieldForSourceSystem:
                {
                    sourcesystem: new RegExp('^(?!Webhook)'),
                    sourceid: new RegExp('alma'), // sourcid voor cdi records is niet alma
                    field: "display.lds12",
                    prefix: "https://lib.is/_/"
                }
            },
            {
                enableInView: '32KUL_.*$',
                replaceFieldForSourceSystem:
                {
                    sourcesystem: new RegExp('Webhook'),
                    sourceid: new RegExp('lirias'),
                    field: "control.sourcerecordid",
                    prefix: "https://lirias.kuleuven.be/"
                }
            }
            //{
            //    enableInView: '32KUL_KUL:Lirias',
            //    replaceWithPnxField: { field: "control.sourcerecordid" },
            //    prefixLink: { prefix: "https://lirias.kuleuven.be/" }
            //}
        ]
    },
    //replaceWithPnxField: ( { reqRes = {}, params = {} } = {} ) => {
    //    path = "config.data.pnx."+params.field
    //    reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);
    //    return reqRes.data;
    //},
    //prefixLink: ( { reqRes = {}, params = {} } = {} ) => {
    //    reqRes.data.permalink = params.prefix + reqRes.data.permalink
    //    return reqRes.data;
    //},
    replaceWithPnxField: ({ reqRes = {}, params = {} } = {}) => {
        path = "config.data.pnx." + params.field
        reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);

        if (params.prefix === "https://lib.is/_/") {
            reqRes.data.permalink = params.prefix + reqRes.data.permalink + "/representation?vid=" + reqRes.config.data.vid + "&scope=" + reqRes.config.data.search_scope + "&tab=" + reqRes.config.data.tab;
        } else {
            reqRes.data.permalink = params.prefix + reqRes.data.permalink + "?"
        }

        return reqRes.data;
    },
    replaceFieldForSourceSystem: ({ reqRes = {}, params = {} } = {}) => {
        const filteredSourceSystemArray = reqRes.config.data.pnx.control.sourcesystem.filter(value => params.sourcesystem.test(value));
        console.log(filteredSourceSystemArray)
        if (filteredSourceSystemArray.length > 0) {
            console.log('Entering interceptor with params', params);
            console.log('Full response:', reqRes);
            if (reqRes.config.data.pnx.control.sourceid.constructor !== Array) {
                reqRes.config.data.pnx.control.sourceid = [reqRes.config.data.pnx.control.sourceid]
            }
            if (reqRes.config.data.pnx.control.sourceid.filter(value => params.sourceid.test(value)).length > 0) {
                console.log('Applying changes for interceptor with params', params);
                path = "config.data.pnx." + params.field
                let linkID = path.split('.').reduce((a, v) => a[v], reqRes);
                console.log('linkID:', linkID)

                if (linkID) {
                    if (params.prefix === "https://lirias.kuleuven.be/") {
                        reqRes.data.permalink = params.prefix + linkID + "?";
                    }
                    else {
                        let vid_codes = reqRes.config.data.vid.split(':');
                        let inst_code = vid_codes[0] in permalink.configuration.linkMap ? vid_codes[0] : 'default';
                        let view_code = vid_codes[1] in permalink.configuration.linkMap[inst_code]['views'] ? vid_codes[1] : 'default';
                        let scope_code = reqRes.config.data.search_scope in permalink.configuration.linkMap[inst_code]['views'][view_code]['scopes'] ? reqRes.config.data.search_scope : 'default';
                        libis_params = [
                            permalink.configuration.linkMap[inst_code]['inst'],
                            permalink.configuration.linkMap[inst_code]['views'][view_code]['code'],
                            permalink.configuration.linkMap[inst_code]['views'][view_code]['scopes'][scope_code]
                        ].join(':');
                        reqRes.data.permalink = params.prefix + linkID + "/representation?libis=" + libis_params;
                    }
                }
            }
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
            Object.keys(action).forEach(a => {
                if (a !== "enableInView") {
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