window.linksServiceRewrite = {
    active: true,
    configuration: {
        afterPnxBaseURL: [
            {
                enableInView: '32KUL_KUL:Lirias',
                removelinks: { type: "backlink" }
            },
            {
                enableInView: '32KUL_KUL:Lirias',
                filter_null: { type: "linktorsrc" }
            },
            {
                enableInView: '32KUL_KADOC:KADOC.*|32KUL_VLP:.*',
                createLinksFromOtherField: { field: "display.lds45" },
            },
            {
                enableInView: '32KUL_KADOC:KADOC.*',
                deliveryForExternalResource: { source: "ScopeArchive" }
            }
            
        ],
        afterDeliveryURL: [
            {
                enableInView: '32KUL_KADOC:KADOC.*|32KUL_VLP:.*',
                createLinksFromOtherField: { field: "display.lds45" }
            },
            {
                enableInView: '32KUL_KADOC:KADOC.*',
                deliveryForExternalResource: { source: "ScopeArchive" }
            }
        ]
    },
    activate: () => {
        linksServiceRewrite.active = true
    },
    /*
    init: (url, headers, params, data, $translate) => {
        console.log ("-----> init links_service_rewrite")
       // console.log ( $translate.instant('nui.customization.browzine.apikey')  )
        let cloned_params = JSON.parse(JSON.stringify(params));
    },
    */
    removelinks: ({ doc = {}, type = "backlink" }) => {
        if (doc.pnx) {
            if (doc.pnx.links) {
                delete doc.pnx.links[type];
            }
        }
        return doc;
    },
    filter_null: ({ doc = {}, type = "linktorsrc" }) => {
        if (doc.pnx) {
            if (doc.pnx.links) {
                if (doc.pnx.links[type]) {
                    doc.pnx.links[type] = doc.pnx.links[type].filter(n => n)
                }
            }
        }
        return doc;
    },

    getValueFromSubfield:  (field, subfield) => {
        try {
            // console.log ( "field: " + field)
            return field.filter(f => f.startsWith(subfield))[0].trim().substring(1);
        } catch {
            return undefined;
        }
    },

    createLinksFromOtherField: ({ doc = {}, field = null }) => {
        // console.log (doc)
        // console.log (field)
        /*
        var getValueFromSubfield = function (link, subfield) {
            try {
                return link.filter(l => l.startsWith(subfield))[0].trim().substring(1);
            } catch {
                return undefined;
            }
        }
        */

        if (doc.pnx) {
            var links = field.split('.').reduce((previous, current) => { return previous[current] }, doc.pnx);

            // console.log("------------------------------")
            // console.log (links)

            if (links) {
                links = links.map(link => {
                    return link.split("$$").filter(el => {
                        return (el != undefined && el != '');
                    });
                })

                // linksDefinitions: (5) ['linktorsrc', 'addlink', 'backlink', 'sourcerecord', '']
                links = links.map(link => {
                    var linkURL =  window.linksServiceRewrite.getValueFromSubfield(link, "U");
                    // check for namespaces in URL, maybe we should use an url template ?
                    var linkType =  window.linksServiceRewrite.getValueFromSubfield(link, "T");
                    if (linkType === undefined) { linkType = '' }
                    var displayLabel =  window.linksServiceRewrite.getValueFromSubfield(link, "C");
                    if (displayLabel === undefined) {
                        displayLabel =  window.linksServiceRewrite.getValueFromSubfield(link, "E");
                    }
                    if (displayLabel === undefined) {
                        displayLabel =  window.linksServiceRewrite.getValueFromSubfield(link, "D");
                    }else{
                        displayLabel = pubSub.translate.instant('fulldisplay.constants.' + displayLabel);
                    }
                    if (displayLabel === undefined) {
                        if (linkType === 'addlink') {
                            displayLabel = "Addition Link";
                        }
                        if (linkType === 'backlink') {
                            displayLabel = "Back Link";
                        }
                    }
                    return {
                        "@id": "_:0",
                        displayLabel: displayLabel,
                        linkType: linkType,
                        linkURL: linkURL,
                        publicNote: null
                    }
                });

                links.sort(
                    function(a, b) {          
                        if (a.linkType === b.linkType) {
                            return a.displayLabel > b.displayLabel ? 1 : -1;
                        }
                        return a.linkType > b.linkType ? 1 : -1;
                    }
                );

                if (doc.delivery) {
                    if (doc.delivery.link) {
                        doc.delivery.link = doc.delivery.link.concat(links)
                    }
                } /* else { 
                    doc.delivery = { link: links }
                } */
            }
        }
        return doc;
    },

    deliveryForExternalResource: ({ doc = {}, source = null  }) => {
        // console.log (doc)
        // console.log (source)
        if (  doc.pnx.display.source.filter(s => source.includes(s)).length > 0 ) {
            if (doc.delivery){

/*
                console.log ( doc.delivery.deliveryCategory )
                console.log ( doc.delivery.deliveryCategory.includes("Remote Search Resource") )
                console.log (doc.delivery.availabilityLinksUrl )
                console.log (doc.delivery.availabilityLinksUrl.length )
                console.log (doc.delivery.availabilityLinksUrl.length > 0)
*/

                if (
                    ( doc.delivery.deliveryCategory.includes("Remote Search Resource") || doc.delivery.deliveryCategory.includes("EXTERNAL-P") )
                    &&
                    doc.delivery.availabilityLinksUrl.length > 0
                ){
                    var displayConstant   = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "C");
                    // console.log ( displayConstant )

                    if ( displayConstant ){
                        /*
                        console.log ( displayConstant )
                        console.log ( pubSub.translate.instant('delivery.code.' + displayConstant) );
                        console.log ( doc.delivery.availabilityLinksUrl[0] )
                        */
                        doc.delivery.displayedAvailability = displayConstant;
                        doc.delivery.availability[0] = displayConstant;
    
                        doc.delivery.electronicServices[0].packageName = pubSub.translate.instant('delivery.code.' + displayConstant);
                        doc.delivery.electronicServices[0].serviceUrl = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U");
                    }   
                }
    
                // console.log ( doc.pnx.display.source )    
            }
        }
        
        return doc;
    }
};

pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    // "linksServiceRewrite".init(url, headers, params, $translate);
    var rewriteActions = linksServiceRewrite.configuration.afterPnxBaseURL.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    if (rewriteActions.length > 0) {
        rewriteActions.forEach(rewriteAction => {

            delete rewriteAction.enableInView;
            // console.log(rewriteAction);
            Object.entries(rewriteAction).forEach(ra => {
                const [action, parameters] = ra;
                // console.log(action, parameters);
                // console.log (reqRes.data)

                // pnxBaseURL is also called for fullview (Permalink)
                // the url than starts with /primaws/rest/pub/pnxs/L/ instead of /primaws/rest/pub/pnxs
                // the url than starts with /primaws/rest/pub/pnxs/SearchWebhook/ instead of /primaws/rest/pub/pnxs
                if (reqRes.data['docs']) {
                    reqRes.data['docs'].map(d => {
                        parameters.doc = d
                        try {
                            d = linksServiceRewrite[action](parameters);
                        } catch (error) {
                            console.error(error);
                        }
                        return d
                    });
                }
                if (reqRes.data['pnx']) {
                    parameters.doc = reqRes.data
                    try {
                        reqRes.data = linksServiceRewrite[action](parameters);
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        });
    }
    return reqRes;
});

pubSub.subscribe('after-deliveryURL', (reqRes) => {
    //console.log('after-deliveryURL')
    //console.log(reqRes)
    var rewriteActions = linksServiceRewrite.configuration.afterDeliveryURL.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    //console.log(reqRes.data[0].delivery.link)
    if (rewriteActions.length > 0) {
        rewriteActions.forEach(rewriteAction => {
            delete rewriteAction.enableInView;
            // console.log(rewriteAction);
            Object.entries(rewriteAction).forEach(ra => {
                const [action, parameters] = ra;
                // console.log(action, parameters);
                // console.log (reqRes.data)
                if (reqRes.data.length > 0) {
                    reqRes.data.map(d => {
                        parameters.doc = d
                        try {
                            d = linksServiceRewrite[action](parameters);
                        } catch (error) {
                            console.error(error);
                        }
                        return d
                    });
                }
            });
        });
    }
    return reqRes;
});

