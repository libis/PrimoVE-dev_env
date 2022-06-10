window.linksServiceRewrite = {
    active: true,
    configuration: {
        afterPnxBaseURL: [
            {
                enableInView: '32KUL_KUL:Lirias',
                removelinks: { type: "backlink" }
            },
            {
                enableInView: '32KUL_KADOC:KADOC|32KUL_VLP:.*',
                createLinksFromOtherField: { field: "display.lds45" }
            }
        ],
        afterDeliveryURL: [
            {
                enableInView: '32KUL_KADOC:KADOC|32KUL_VLP:.*',
                createLinksFromOtherField: { field: "display.lds45" }
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
    createLinksFromOtherField: ({ doc = {}, field = null }) => {
        // console.log (doc)
        // console.log (field)
        var getValueFromSubfield = function (link, subfield) {
            try {
                return link.filter(l => l.startsWith(subfield))[0].trim().substring(1);
            } catch {
                return undefined;
            }
        }

        if (doc.pnx) {
            var links = field.split('.').reduce((previous, current) => { console.log(previous); return previous[current] }, doc.pnx);


            if (links) {
                links = links.map(link => {
                    return link.split("$$").filter(el => {
                        return (el != undefined && el != '');
                    });
                })

                // linksDefinitions: (5) ['linktorsrc', 'addlink', 'backlink', 'sourcerecord', '']

                links = links.map(link => {
                    var linkURL = getValueFromSubfield(link, "U");
                    // check for namespaces in URL, maybe we should use an url template ?
                    var linkType = getValueFromSubfield(link, "T");
                    if (linkType === undefined) { linkType = '' }
                    var displayLabel = getValueFromSubfield(link, "C");
                    if (displayLabel !== undefined) {
                        displayLabel = pubSub.translate.instant('fulldisplay.constants.' + displayLabel);
                    }
                    if (displayLabel === undefined) {
                        displayLabel = getValueFromSubfield(link, "E");
                        displayLabel = pubSub.translate.instant('fulldisplay.constants.' + displayLabel);

                    }
                    if (displayLabel === undefined) {
                        displayLabel = getValueFromSubfield(link, "D");
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

                console.log(links)

                if (doc.delivery) {
                    if (doc.delivery.link) {
                        doc.delivery.link = doc.delivery.link.concat(links)
                    }
                } /* else { 
                    doc.delivery = { link: links }
                } */
                console.log(doc)
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
    console.log('after-deliveryURL')
    console.log(reqRes)
    var rewriteActions = linksServiceRewrite.configuration.afterDeliveryURL.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    console.log(reqRes.data[0].delivery.link)
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

