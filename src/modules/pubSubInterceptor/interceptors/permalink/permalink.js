//
// pnx contains
// 
//                | control.sourceid | control.sourcesystem | display.source
// Alma           | "alma"           | ["ILS"]              | ["Alma"]
// CDI            | ["gale_plos_...  | ["Other"]            | ["DOAJ... 
// Parochiebl...  | "alma"           | ["ROSETTA_OAI_DC1"]  | ["Alma"]
// Trajecta       | "alma"           | ["Other"]            | ["Trajecta"]  
// Lirias_basic   | "alma"           | ["Other"]            | ["Lirias_basic"]
// RUUSBROEC_ANET | "alma"           | ["Other"]            | ["RUUSBROEC_ANET"]
// ODIS           | "alma"           | ["Other"]            | ["ODIS_organisations"]
// ScopeArchiv    | "alma"           | ["Other"]            | ["KADOC_ScopeArchiv"]
// Lirias         | "lirias"         | ["Webhook"]          | ["lirias"]

// control.sourceid is "alma" and control.sourcesystem contains "ILS" 
//     => use pnx.control.recordid in permalink and prefix with "https://lib.is/_/"
// control.sourceid is NOT "alma" and control.sourcesystem contains "Other" 
//     => use pnx.control.recordid in permalink and prefix with "https://lib.is/_/"
// ===> All permalinks are initially converted to this form without any checking (except the view is not activates)
// ===> Checks on sourceid and sourcesystem will determine if lds12, sourcerecordid or other fields must be used
// 
// control.sourceid is "alma" and control.sourcesystem does not contains "ILS"
//     => use pnx.display.lds12 in permalink if it exists and prefix with "https://lib.is/_/"
// control.sourceid is "lirias" and control.sourcesystem contains "Webhook"
//     => use pnx.control.sourcerecordid in permalink and prefix with https://lirias.kuleuven.be/



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
                enableInView: '32KUL_.*$',
                replaceWithPnxField: 
                { 
                    field: "control.recordid", 
                    prefix: "https://lib.is/_/"
                }
            },
            {
                enableInView: '32KUL_.*$',
                replaceFieldForSourceSystem: 
                { 
                    sourcesystem: new RegExp('^(?!ILS)') ,  // sourcesystem: cdi => Other; Parochiebladen => ROSETTA_OAI_DC1 Mag NIET gelijk zijn aan ILS
                    sourceid: 'alma',          // cdi heeft dit niet als sourceid
                    field:  "display.lds12", 
                    prefix: "https://lib.is/_/"
                }
            },
            {
                enableInView: '32KUL_.*$',
                replaceFieldForSourceSystem: 
                { 
                    sourcesystem: new RegExp('Webhook'),  
                    sourceid: 'lirias',          
                    field:  "control.sourcerecordid", 
                    prefix:"https://lirias.kuleuven.be/"  
                }
            }
            /*
            ,
            {
                enableInView: '32KUL_KUL:Lirias',
                replaceWithPnxField: 
                { 
                    field: "control.sourcerecordid", 
                    prefix: "https://lirias.kuleuven.be/"  
                }
            }
                */
            
        ]
    },
    replaceWithPnxField: ( { reqRes = {}, params = {} } = {} ) => {
        path = "config.data.pnx."+params.field
        reqRes.data.permalink = path.split('.').reduce((a, v) => a[v], reqRes);

        if ( params.prefix === "https://lib.is/_/"){
            reqRes.data.permalink = params.prefix + reqRes.data.permalink + "/representation?vid="+ reqRes.config.data.vid +"&scope="+ reqRes.config.data.search_scope  +"&tab="+ reqRes.config.data.tab;;
        }else{
            reqRes.data.permalink = params.prefix + reqRes.data.permalink +"?"
        } 
        
        return reqRes.data;
    },
    replaceFieldForSourceSystem: ( { reqRes = {}, params = {} } = {} ) => {
        const filteredSourceSystemArray = reqRes.config.data.pnx.control.sourcesystem.filter(value => params.sourcesystem.test(value) );
        console.log (filteredSourceSystemArray )
        if (filteredSourceSystemArray.length > 0 ) { 
            if ( params.sourceid == reqRes.config.data.pnx.control.sourceid ){
                path = "config.data.pnx."+ params.field
                let permalink = path.split('.').reduce((a, v) => a[v], reqRes);    
                if (permalink){
                    reqRes.data.permalink = params.prefix + permalink + ":"+ reqRes.config.data.vid +"."+ reqRes.config.data.search_scope +"?";
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
            Object.keys(action).forEach( a => {
                if (a !== "enableInView"){
                    try {
                        console.log ( reqRes.data.permalink )
                        reqRes.data = permalink[a]({ reqRes: reqRes, params: action[a] });
                        console.log ( reqRes.data.permalink )
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
        });
    }

    return reqRes;
});