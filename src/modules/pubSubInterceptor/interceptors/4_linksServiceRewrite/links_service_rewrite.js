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
                deliveryForExternalResource: { source: "KADOC_ScopeArchiv", field: "display.lds37" }
            },
            {
                enableInView: '^(?!(32KUL_KUL:Lirias))',// originele setting: 32KUL_KUL:KULeuven_TEST
                transformDeliveryLinks: { recordSource: ["Lirias_basic"], field1: "electronicServices", field2: ["GetIt1", "links", "link"], field3: "availabilityLinksUrl", field4: "link", type: "addlink" }
            },
            {
                enableInView: '32KUL_ACV:ACV|32KUL_BPB:BPB|32KUL_DOCVB:docvlaamsbrabant|32KUL_HUB:ODISEE|32KUL_KADOC:KADOC|32KUL_KATHO:VIVES|32KUL_KHK:TMOREK|32KUL_KHL:UCLL|32KUL_KHM:TMOREMA|32KUL_KUL:KULeuven|32KUL_KUL:music|32KUL_LIBIS_NETWORK:LIBISNET2_UNION|32KUL_LUCAWENK:LUCA|32KUL_LUCAWENK:music|32KUL_VLP:VLP|32KUL_VLER:VBS',
                linkReadingExcerpt: { source: "Meta4books", field: "display.lds37", link: "display.lds45" }
            }
        ],
        afterDeliveryURL: [
            {
                enableInView: '32KUL_KADOC:KADOC.*|32KUL_VLP:.*',
                createLinksFromOtherField: { field: "display.lds45" }
            },
            {
                enableInView: '32KUL_KADOC:KADOC.*',
                deliveryForExternalResource: { source: "KADOC_ScopeArchiv", field: "display.lds37" }
            },
            {
                enableInView: '^(?!(32KUL_KUL:Lirias))',// originele setting: 32KUL_KUL:KULeuven_TEST
                transformDeliveryLinks: { recordSource: ["Lirias_basic"], field1: "electronicServices", field2: ["GetIt1", "links", "link"], field3: "availabilityLinksUrl", field4: "link", type: "addlink" }
            },
            {
                enableInView: '32KUL_ACV:ACV|32KUL_BPB:BPB|32KUL_DOCVB:docvlaamsbrabant|32KUL_HUB:ODISEE|32KUL_KADOC:KADOC|32KUL_KATHO:VIVES|32KUL_KHK:TMOREK|32KUL_KHL:UCLL|32KUL_KHM:TMOREMA|32KUL_KUL:KULeuven|32KUL_KUL:music|32KUL_LIBIS_NETWORK:LIBISNET2_UNION|32KUL_LUCAWENK:LUCA|32KUL_LUCAWENK:music|32KUL_VLP:VLP|32KUL_VLER:VBS',
                linkReadingExcerpt: { source: "Meta4books", field: "display.lds37", link: "display.lds45" }
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

    getValueFromSubfield: (field, subfield) => {
        try {
            // console.log ( "field: " + field)
            return field.filter(f => f.startsWith(subfield))[0].trim().substring(1);
        } catch {
            return undefined;
        }
    },

    linkReadingExcerpt: ({ doc = {}, field = null, link = null }) => {

        if (doc.pnx) {
            console.log('Checking reading excerpts');
            console.log('Field 37: ', doc.pnx.display);
            var scope = field.split('.').reduce((previous, current) => { return previous[current] }, doc.pnx);
            console.log("Meta4books - check scope: ", scope);

            if ((scope) && (scope.includes('Meta4books'))) {
                console.log('Handling reading excerpt');
                var links = link.split('.').reduce((previous, current) => { return previous[current] }, doc.pnx);
                console.log(links);
                if (links) {
                    links = links.map(url => {
                        return {
                            "@id": "_:0",
                            displayLabel: "Reading excerpt via Boekenbank.be",
                            linkType: "addlink",
                            linkURL: url,
                            publicNote: null
                        }
                    });
                    console.log('links', links);

                    if (doc.delivery) {
                        console.log(doc.delivery)
                        if (doc.delivery.link) {
                            doc.delivery.link = doc.delivery.link.concat(links)
                        }
                    }
                }


            }

        }
        return doc;
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
                    var linkURL = window.linksServiceRewrite.getValueFromSubfield(link, "U");
                    // check for namespaces in URL, maybe we should use an url template ?
                    var linkType = window.linksServiceRewrite.getValueFromSubfield(link, "T");
                    if (linkType === undefined) { linkType = '' }
                    var displayLabel = window.linksServiceRewrite.getValueFromSubfield(link, "C");
                    if (displayLabel === undefined) {
                        displayLabel = window.linksServiceRewrite.getValueFromSubfield(link, "E");
                    }
                    if (displayLabel === undefined) {
                        displayLabel = window.linksServiceRewrite.getValueFromSubfield(link, "D");
                    } else {
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
                    function (a, b) {
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

    deliveryForExternalResource: ({ doc = {}, source = null, field = null }) => {
        // console.log (doc)
        // console.log(source)
        // console.log(doc.pnx.display.source)
        // console.log(doc.pnx.display.source.filter(s => source.includes(s)).length > 0)
        if (doc.pnx.display.source.filter(function (s) {
            return source.includes(s);
        }).length > 0) {
            if (doc.delivery) {
                //console.log("Delivering")
                /*
                                console.log ( doc.delivery.deliveryCategory )
                                console.log ( doc.delivery.deliveryCategory.includes("Remote Search Resource") )
                                console.log (doc.delivery.availabilityLinks )
                                console.log (doc.delivery.availabilityLinksUrl )
                                console.log (doc.delivery.availabilityLinksUrl.length )
                                console.log (doc.delivery.availabilityLinksUrl.length > 0)
                */
                if (
                    (doc.delivery.deliveryCategory.includes("Remote Search Resource") || doc.delivery.deliveryCategory.includes("EXTERNAL-P"))
                    &&
                    doc.delivery.availabilityLinksUrl.length > 0
                ) {
                    //console.log("DeliveryLink - part 1")

                    var displayConstant = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "C");

                    //console.log('Calculated display constant:', displayConstant)

                    /* Old version of interceptor - handles records with display constant loaded into URL */
                    if (displayConstant) {
                        console.log('Activating advanced link handling')
                        doc.delivery.displayedAvailability = displayConstant;
                        doc.delivery.availability[0] = displayConstant;

                        //console.log("DeliveryLink - part 2")

                        /* Will be handled in \components\availabilityLine\ScopeArchive\index.js */
                        //                        doc.delivery.availabilityLinks = ['directlink']
                        //                        window.appConfig['system-configuration']['enable_direct_linking_in_record_full_view'] = true;

                        if (doc.delivery.deliveryCategory.includes("Remote Search Resource")) {
                            doc.delivery.electronicServices[0].packageName = pubSub.translate.instant('delivery.code.' + displayConstant);
                            doc.delivery.electronicServices[0].serviceUrl = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U");
                            //console.log("DeliveryLink - part 3")
                        }
                        if (doc.delivery.deliveryCategory.includes("EXTERNAL-P") && doc.delivery.availabilityLinksUrl[0]) {
                            doc.delivery.electronicServices[0] = { serviceUrl: window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U") }
                            //console.log("DeliveryLink - part 4")
                        }

                        doc.delivery.availabilityLinksUrl[0] = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U");
                        doc.delivery.link = doc.delivery.link.filter(l => { return !new RegExp(displayConstant).test(l.linkURL) })

                        //console.log(doc.delivery.link)
                    }
                    else {
                        console.log('Activating basic link handling')
                        //console.log("DeliveryLink - part new1")
                        var displayConstant = field.split('.').reduce((previous, current) => { return previous[current] }, doc.pnx)[0];

                        //console.log('Calculated display constant:', displayConstant)

                        if (displayConstant) {
                            doc.delivery.displayedAvailability = displayConstant;
                            doc.delivery.availability[0] = displayConstant;

                            //console.log("DeliveryLink - part new2")

                            /* Will be handled in \components\availabilityLine\ScopeArchive\index.js */
                            //                        doc.delivery.availabilityLinks = ['directlink']
                            //                        window.appConfig['system-configuration']['enable_direct_linking_in_record_full_view'] = true;

                            if (doc.delivery.deliveryCategory.includes("Remote Search Resource")) {
                                //console.log("DeliveryLink - part new3")
                                //console.log('Electronic services - before processing:', doc.delivery.electronicServices[0])
                                let i = 0;
                                while (i < doc.delivery.electronicServices.length) {
                                    doc.delivery.electronicServices[i].packageName = pubSub.translate.instant('delivery.code.' + displayConstant);
                                    i++;
                                }

                                //console.log('Electronic services - after processing:', doc.delivery.electronicServices)
                            }

                            //console.log("DeliveryLink - part new4")
                            doc.delivery.link = doc.delivery.link.filter(l => { return !new RegExp(/Link to (?:resource|request)/).test(l.displayLabel) })

                            //console.log('Delivery link', doc.delivery.link);
                        }
                    }


                }

            }
        }

        return doc;
    },

    getValueFromSubfield: (field, subfield) => {
        try {
            // console.log ( "field: " + field)
            return field.filter(f => f.startsWith(subfield))[0].trim().substring(1);
        } catch {
            return undefined;
        }
    },

    /* Basismethode voor de vertaling van display constants bij basic Lirias records in online-delivery velden waar dit niet automatisch gebeurt.
         * Stelt subvelden $$U and $$D in als respectievelijk URL en displaylabel, incl. detectie en aanduiding van Lirias delivery URLs.
         * Input: delivery URL met display constants --- Output: array met URL en custom displaylabel.
         * Creatiecontext: customization van delivery URL in Primo VE basic view voor Lirias records met Full-text access.*/
    getUrlAndLabel: (linkfield) => {
        try {
            //Verdeling in subvelden
            var urlString = linkfield.trim().split('$$');

            // Extractie subveld 'U'. Deze waarde wordt als delivery URL gebruikt.
            var baseUrl = window.linksServiceRewrite.getValueFromSubfield(urlString, "U");

            /* Ophalen  en instellen labelinfo. Voor het label wordt de description uit subfield 'D' gebruikt indien aanwezig.
                 * Als subfield 'D' niet aanwezig is, wordt een default waarde ingesteld.
                 * Met custom vermelding voor Lirias delivery URLs. Andere bronnen worden als 'external source' aangegeven.*/
            var displayLabel = window.linksServiceRewrite.getValueFromSubfield(urlString, "D");

            // Toevoeging bronaanduiding in displaylabel
            if (displayLabel === undefined) {
                displayLabel = "Link to full text";
            }

            if (baseUrl.match('^https://lirias.kuleuven.be/retrieve')) {
                displayLabel += " - Lirias";
            }
            else {
                displayLabel += " - external source";
            }
            return [baseUrl, displayLabel];
        }
        catch {
            return undefined;
        }
    },

    /* Methode voor de omzetting van displayconstants in online delivery velden waar dit niet automatisch gebeurt.
     Creatiecontext: Basisview in Primo VE voor Lirias records met full-text access.*/
    transformDeliveryLinks: ({ doc = {}, recordSource = null, field1 = null, field2 = null, field3 = null, field4 = null, type = null }) => {

        // Test of het om een Lirias record gaat op basis van de data source.
        // liriasRec = doc.pnx.control.originalsourceid.find(id => id.startsWith(recordType));
        // console.log(doc.pnx.display.source);
        // console.log(doc.pnx.display.source.filter(s => recordSource.includes(s)).length > 0);
        if ((doc.pnx.display.source.filter(function (s) {
            return recordSource.includes(s);
        }).length > 0)
            || (doc.delivery && doc.delivery.electronicServices && doc.delivery.electronicServices.some(function (s) { return s['ilsApiId'].match(/^lirias/); }))) {
            //console.log('Delivering Lirias...')
            //console.log(doc.delivery.electronicServices)

            // Regular Expression voor de detectie van display constants in URLs, gekenmerkt door de aanwezigheid van subveld-indicatoren startend met '$$'.
            const linkSign = new RegExp(/\$\$/);

            if (doc.delivery) {
                //SEGMENT 1: ELECTRONIC SERVICES - Vertaling display constants in directe delivery URLs van veld 'View Online' in full display.
                if (doc.delivery[field1]) {
                    // Ophalen veld 'electronicServices'. ElectronicServices is als een array gestructureerd.
                    var serv1 = doc.delivery[field1];
                    //var serv1 = field1.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);

                    // Loop doorheen array uit veld 'electronicServices' en bewerk individuele entries
                    serv1.forEach(link => {
                        // console.log(link.serviceUrl);
                        if (link.serviceUrl.match(linkSign)) {
                            var linkData = window.linksServiceRewrite.getUrlAndLabel(link.serviceUrl);
                            link.serviceUrl = linkData[0];
                            link.packageName = linkData[1];
                        }
                    });
                }

                // SEGMENT 2: GETIT
                if (doc.delivery[field2[0]]) {
                    // Ophalen sectie doc.delivery.GetIt1. GetIt1 is gestructureerd als een array. Veldnaam is geconfigueerd via variabele 'field2', eerste element binnen de array.
                    var serv2 = doc.delivery[field2[0]];
                    //var serv2 = field2.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);

                    serv2.forEach(hold => {
                        // Ophalen set Links. Veldnaam is geconfigureerd via variabele 'field2', tweede element binnen de array.
                        var links = hold[field2[1]];

                        links.forEach(getLink => {
                            // Ophalen individuele link. Veldnaam is geconfigueerd via variabele 'field2', derde element in de array.
                            var baseLink = getLink[field2[2]];

                            // Vertaling van display constants. Code wordt enkel uitgevoerd als bij links met ilsApiId 'lirias' en aanwezigheid van string '$$'.
                            if (getLink["ilsApiId"].match("lirias") && baseLink.match(linkSign)) {
                                var linkData = window.linksServiceRewrite.getUrlAndLabel(baseLink);
                                getLink.link = linkData[0];
                                getLink.displayText = "Get full text - ";

                                if (linkData[1].match("Lirias")) {
                                    getLink.displayText += "Lirias";
                                }
                                else {
                                    getLink.displayText += "External source";
                                }
                            }
                        });
                    });
                }

                // SEGMENT 3: Availability URL - Vertaling van displayconstants in direct delivery URL in de brief display.
                if (doc.delivery[field3]) {
                    // Inladen segment 'doc.delivery.availabilityUrls'. Veldnaam is geconfigureerd via variabele 'field3'.
                    var serv3 = field3.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);

                    // Array voor opslag van correcte URLs.
                    var linkSet = []

                    serv3.forEach(link => {
                        /* Vertaling van display constants. Een if-clause gaat na of de URL display constants bevat.
                        Zo ja, dan wordt de URL uit de basisstring ge�soleerd. Zo nee, dan wordt de URL onveranderd toegevoegd aan linkSet.*/
                        if (link.match(linkSign)) {
                            var linkData = window.linksServiceRewrite.getUrlAndLabel(link);
                            link = linkData[0];
                        }

                        linkSet.push(link);
                    });
                    /* Terugplaatsen van aangepaste URL-set in 'availabilityURLS'.
                    Ook ongewijzigde URLs zijn in de array toegevoegd, dus de oude waarde kan veilig overschreven worden.*/
                    doc.delivery.availabilityLinksUrl = linkSet;
                }

                // SEGMENT 4: LINKS SECTION - Vertaling van display constants in URLs in de links-sectie van de full display.
                if (doc.delivery[field4]) {
                    //Inladen segment 'doc.delivery.link'. Veldnaam is geconfigueerd via variabele 'field4'.
                    var serv4 = doc.delivery[field4];

                    var newLinks = serv4.filter(link => !(link["linkType"] == type));
                    console.log(newLinks)

                    var sourceId = doc.pnx.control.originalsourceid[0].match(/^lirias(?<id>[0-9]*)/)

                    if (sourceId) {
                        let liriasLink = {
                            "@id": "_:0",
                            displayLabel: "View detailed record (Lirias)",
                            linkType: "backlink",
                            linkURL: "https://lirias.kuleuven.be/" + sourceId.groups.id,
                            publicNote: null
                        }

                        newLinks.push(liriasLink);
                    }

                    doc.delivery[field4] = newLinks;
                }
            }
        }
        //console.log(doc);
        return doc;
    }
}

pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    //console.log('after-pnxBaseURL')
    //console.log('reqRes:', reqRes)
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
                // the url then starts with /primaws/rest/pub/pnxs/L/ instead of /primaws/rest/pub/pnxs
                // the url then starts with /primaws/rest/pub/pnxs/SearchWebhook/ instead of /primaws/rest/pub/pnxs
                // For saved items, the url starts with /primaws/rest/pub/pnxs/U and the pnx-records are direct children of the data object

                // Scenario 1: return data contains array of pnx records in element 'docs'
                // Application range: search/brief results
                if (reqRes.data['docs']) {
                    //console.log('Rewrite type 1')
                    reqRes.data['docs'].map(d => {
                        parameters.doc = d
                        try {
                            d = linksServiceRewrite[action](parameters);
                        } catch (error) {
                            console.error(error);
                        }
                        //console.log(d)
                        return d
                    });
                }
                // Scenario 2: return data is a single pnx record, encoded as a single object 'data' at top level (data = pnx record)
                // Application range: full view, permalinks
                if (reqRes.data['pnx']) {
                    //console.log('Rewrite type 2')
                    //console.log('Array check type 2:', reqRes.data instanceof Array)
                    parameters.doc = reqRes.data
                    try {
                        reqRes.data = linksServiceRewrite[action](parameters);
                    } catch (error) {
                        console.error(error);
                    }
                }
                // Scenario 3: return data is an array of pnx records, encoded in element 'data'
                // Application range: saved items
                if (reqRes.data instanceof Array) {
                    //console.log('Rewrite type 3')
                    //console.log('Array check type 3:', reqRes.data instanceof Array)
                    //console.log('Found data, but not docs...')
                    //console.log(reqRes)
                    reqRes.data.map(d => {
                        parameters.doc = d;
                        try {
                            d = linksServiceRewrite[action](parameters);
                        } catch (error) {
                            console.error(error);
                        }
                        return d;
                    });
                }
            });
        });
    }
    return reqRes;
})

pubSub.subscribe('after-deliveryURL', (reqRes) => {
    //console.log('after-deliveryURL')
    //console.log('reqRes:', reqRes)
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

