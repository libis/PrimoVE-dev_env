window.webhookDeeplinkFulldisplay = {
    active: true,
    activate: () => {
        webhookDeeplinkFulldisplay.active = true
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

async function webhookDeeplinkFulldisplayGetRecord(recordId, vid, institution, search_scope, tab) {
    let view = await Primo.view;

    // recordId = recordId.toLowerCase();

    let prm_full_view = document.getElementById('fullView');
    if ( prm_full_view != null){
        prm_full_view.style.display = 'none';
    }

    let searchUrl = `/primaws/rest/pub/pnxs?blendFacetsSeparately=false&getMore=0&inst=${institution}&lang=en&limit=10&newspapersActive=false&newspapersSearch=false&offset=0&pcAvailability=true&q=any,contains,${recordId}&qExclude=&qInclude=&rapido=false&refEntryActive=false&rtaLinks=true&scope=${search_scope}&skipDelivery=Y&sort=rank&tab=${tab}&vid=${vid}`

    let headers = {
        "content-type": "application/json",
        "mode": "cors",
        "accept": "application/json",
        "referrer": `${window.location.protocol}${window.location.host}/discovery/fulldisplay?`
      }

    var search = await Primo.bridge.http.get ( searchUrl );

    let record = search.data.docs[0] || null;

    if (record) {
        recordId = record.pnx.control.recordid[0]
        let referrer = `${window.location.protocol}${window.location.host}/discovery/fulldisplay?docid=${recordId}&context=${record.context}&vid=${view.code}&lang=${view.interfaceLanguage}&search_scope=${search_scope}&adaptor=${record.adaptor}&tab=${tab}&query=any,contains,${recordId}&offset=0`;
        let data = {
          "context": record.context,
          "pnx": record.pnx,
          "recordId": recordId
        }
        let headers = {
          "content-type": "application/json",
          "mode": "cors",
          "accept": "application/json",
          "referrer": referrer
        }

        r = await Primo.bridge.http.post(`/primaws/rest/pub/addToRemoteRecordTable?lang=${view.interfaceLanguage}`, JSON.stringify(data), headers);

        if ( r.status == 200 ) {
            console.log (r)
            // alert ("adda toaddToRemoteRecordTable  -- - - -")
            location.reload();
        }else{
            console.log (r)
            let prm_full_view = document.getElementById('fullView');
            if ( prm_full_view != null){
                prm_full_view.style.display = 'block';
            }      
        }

    }else{
        let prm_full_view = document.getElementById('fullView');
        if ( prm_full_view != null){
            prm_full_view.style.display = 'block';
        }
    }

    if ( search.status != 200 ) {

        let prm_full_view = document.getElementById('fullView');
        if ( prm_full_view != null){
            prm_full_view.style.display = 'block';
        }

    }

}



pubSub.subscribe('after-pnxBaseURL', (reqRes) => {

    // console.log ( window.document.referrer == window.location )
    // console.log ( window.location )
    // console.log ( window.location )
    
    if ( /discovery\/fulldisplay/.test(window.location.pathname) && window.document.referrer != window.location ){
        if ( reqRes.data.docs.length > 0){
            console.log ("webhookDeeplinkFulldisplay Record Already available in RemoteRecordTable ")
        }

        if (/primaws\/rest\/pub\/pnxs\/SearchWebhook/.test(reqRes.config.url) && reqRes.data.docs.length === 0) {
            var url = new URL(  window.location.protocol + "//" + window.location.host + reqRes.config.url );
            var recordId = url.pathname.split('/').pop();
            var vid = url.searchParams.get('vid');
            var tab = url.searchParams.get('tab');           
            var institution = vid.split(":")[0];
            var search_scope = url.searchParams.get('search_scope');
            webhookDeeplinkFulldisplayGetRecord(recordId, vid, institution, search_scope, tab) 
            
        }
    }
    return reqRes;
});


// https://kuleuven.limo.libis.be/discovery/fulldisplay?docid=lirias1950175&context=SearchWebhook&vid=32KUL_KUL:Lirias&lang=en&search_scope=lirias_profile&adaptor=SearchWebhook&tab=LIRIAS&query=any%2Ccontains%2CLIRIAS1950175&offset=0