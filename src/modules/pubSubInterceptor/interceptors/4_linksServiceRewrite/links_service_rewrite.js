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
            },
            {
                enableInView: '32KUL_KUL:KULeuven_TEST',
                transformDeliveryLinks: { recordType: "lirias", field1: "electronicServices", field2: ["GetIt1", "links", "link"], field3: "availabilityLinksUrl", field4:"link", type:"addlink"}
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
            },
            {
                enableInView: '32KUL_KUL:KULeuven_TEST',
                transformDeliveryLinks: { recordType: "lirias", field1: "electronicServices", field2: ["GetIt1", "links", "link"], field3: "availabilityLinksUrl", field4: "link", type:"addlink"}
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

    deliveryForExternalResource: ({ doc = {}, source = null }) => {
        // console.log (doc)
        // console.log (source)
        if (doc.pnx.display.source.filter(s => source.includes(s)).length > 0) {
            if (doc.delivery) {
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

                    var displayConstant = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "C");

                    //                    console.log ( displayConstant )

                    if (displayConstant) {
                        doc.delivery.displayedAvailability = displayConstant;
                        doc.delivery.availability[0] = displayConstant;

                        /* Will be handled in \components\availabilityLine\ScopeArchive\index.js */
                        //                        doc.delivery.availabilityLinks = ['directlink']
                        //                        window.appConfig['system-configuration']['enable_direct_linking_in_record_full_view'] = true;

                        if (doc.delivery.deliveryCategory.includes("Remote Search Resource")) {
                            doc.delivery.electronicServices[0].packageName = pubSub.translate.instant('delivery.code.' + displayConstant);
                            doc.delivery.electronicServices[0].serviceUrl = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U");
                        }
                        if (doc.delivery.deliveryCategory.includes("EXTERNAL-P") && doc.delivery.availabilityLinksUrl[0]) {
                            doc.delivery.electronicServices[0] = { serviceUrl: window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U") }
                        }

                        doc.delivery.availabilityLinksUrl[0] = window.linksServiceRewrite.getValueFromSubfield(doc.delivery.availabilityLinksUrl[0].split("$$"), "U");
                        doc.delivery.link = doc.delivery.link.filter(l => { return !new RegExp(displayConstant).test(l.linkURL) })

                        console.log(doc.delivery.link)

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

    /* Basismethode voor de vertaling van display constants in online-delivery velden waar dit niet automatisch gebeurt.
     * Stelt subvelden $$U and $$D in als respectievelijk URL en displaylabel, incl. detectie en aanduiding van Lirias delivery URLs.
     * Input: delivery URL met display constants --- Output: array met URL en custom displaylabel.
     * Creatiecontext: customization van delivery URL in Primo VE basic view voor Lirias records met Full-text access.*/
    getUrlAndLabel: (linkfield) => {
        try {
            //Verdeling is subvelden
            var urlString = linkfield.trim().split('$$');
            //console.log(urlString);

            // Extractie subveld 'U'. Deze waarde wordt als delivery URL gebruikt.
            var baseUrl = window.linksServiceRewrite.getValueFromSubfield(urlString, "U");
            //console.log(baseUrl);

            /* Ophalen  en instellen labelinfo. Voor het label wordt de description uit subfield 'D' gebruikt indien aanwezig.
                 * Als subfield 'D' niet aanwezig is, wordt een default waarde ingesteld.
                 * Met custom vermelding voor Lirias delivery URLs. Andere bronnen worden als 'external source' aangegeven.*/
            var displayLabel = window.linksServiceRewrite.getValueFromSubfield(urlString, "D");
            //console.log("display: " + displayLabel);

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
     * Input: Java object op basis van pnx text-file. --- Output: aangepast Java object met custom delivery URLs en display-labels.
     * Creatiecontext: Basisview in Primo VE voor Lirias records met full-text access.*/
    transformDeliveryLinks: ({ doc = {}, recordType=null, field1 = null, field2=null, field3=null, field4=null, type = null}) => {

        liriasRec = doc.pnx.control.originalsourceid.find(id => id.startsWith(recordType));
        console.log(liriasRec);
        if (liriasRec) {
            console.log("Lirias record");

            const linkSign = new RegExp(/\$\$/);

            if (doc.delivery) {
                console.log("Start section 1")
                //SEGMENT 1: ELECTRONIC SERVICES - Vertaling display constants in directe delivery URLs van veld 'View Online' in full display.
                if (doc.delivery[field1]) {
                    // Ophalen veld 'electronicServices'. ElectronicServices is als een array gestructureerd.
                    var serv1 = doc.delivery[field1];
                    //var serv1 = field1.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);

                    // Loop doorheen array uit veld 'electronicServices' en bewerk individuele entries
                    serv1.forEach(link => {
                        if (link.serviceUrl.match(linkSign)) {
                            //console.log(link.serviceUrl);
                            linkData = window.linksServiceRewrite.getUrlAndLabel(link.serviceUrl);
                            link.serviceUrl = linkData[0];
                            //console.log("baseUrl: " + baseUrl);   

                            /* Ophalen  en instellen labelinfo. Voor het label wordt de description uit subfield 'd' gebruikt indien aanwezig.
                             * Als subfield 'd' niet aanwezig is, wordt een default waarde ingesteld
                             * Het displaylabel wordt in veld packageName ingesteld */
                            //displayLabel = window.linksServiceRewrite.getValueFromSubfield(urlString, "D");
                            //console.log("display: " + displayLabel);

                            // Toevoeging bronaanduiding in displaylabel
                            //if (displayLabel === undefined) {
                            //    displayLabel = "Link to full text";
                            //}

                            //if (baseUrl.match('^https://lirias.kuleuven.be/retrieve')) {
                            //    displayLabel += " - Lirias";
                            //}
                            //else {
                            //    displayLabel += " - external source";
                            //}

                            link.packageName = linkData[1];
                            //console.log(link);
                            console.log("End section 1")
                        }
                    });
                }

                //serv1.forEach(link => { console.log(link); })

                // SEGMENT 2: GETIT
                if (doc.delivery[field2[0]]) {
                    console.log("Start section 2")
                    // Ophalen sectie doc.delivery.GetIt1. GetIt1 is gestructureerd als een array. Veldnaam is geconfigueerd via variabele 'field2', eerste element binnen de array.
                    var serv2 = doc.delivery[field2[0]];
                    //var serv2 = field2.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);
                    //console.log("getIt: " + serv2);

                    serv2.forEach(hold => {
                        //console.log(hold);
                        // Ophalen set links. Links is gestructureerd als een array. Veldnaam is geconfigureerd via variabele 'field2', tweede element binnen de array.
                        var links = hold[field2[1]];
                        //console.log(links);

                        links.forEach(getLink => {
                            // Ophalen individuele link. Veldnaam is geconfigueerd via variabele 'field2', derde element in de array.
                            var baseLink = getLink[field2[2]];
                            //console.log(baseLink);
                            //console.log("API: " + getLink["ilsApiId"]);
                            //console.log("linking: " + baseLink);
                            if (getLink["ilsApiId"].match("lirias") && baseLink.match(linkSign)) {
                                linkData = window.linksServiceRewrite.getUrlAndLabel(baseLink);
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
                    console.log("End section 1")
                    //console.log("new getit: " + serv2);
                }

                // SEGMENT 3: Availability URL - Vertaling van displayconstants in direct delivery URL in de brief display.
                if (doc.delivery[field3]) {
                    console.log("Start section 3")
                    // Inladen segment 'doc.delivery.availabilityUrls'. Veldnaam is geconfigureerd via variabele 'field3'.
                    var serv3 = field3.split('.').reduce((previous, current) => { return previous[current] }, doc.delivery);
                    //console.log("urls: " + serv3);

                    // Array voor opslag van correcte URLs.
                    linkSet = []

                    serv3.forEach(link => {
                        //console.log(link);
                        /* Vertaling van display constants. Een if-clause gaat na of de URL display constants bevat.
                        Zo ja, dan wordt de URL uit de basisstring geïsoleerd. Zo nee, dan wordt de URL onveranderd toegevoegd aan linkSet.*/
                        if (link.match(linkSign)) {
                            linkData = window.linksServiceRewrite.getUrlAndLabel(link);
                            link = linkData[0];
                            //console.log('changedLink: ' + link);
                        }

                        linkSet.push(link);
                        //console.log(linkSet);
                    });
                    /* Terugplaatsen van aangepaste URL-set in 'availabilityURLS'.
                    Ook ongewijzigde URLs zijn in de array toegevoegd, dus de oude waarde kan veilig overschreven worden.*/
                    doc.delivery.availabilityLinksUrl = linkSet;

                    //console.log("new urls: " + doc.delivery.availabilityLinksUrl);
                    console.log("End section 3")
                }

                // SEGMENT 4: LINKS SECTION - Vertaling van display constants in URLs in de links-sectie van de full display.
                if (doc.delivery[field4]) {
                    console.log("Start section 4")
                    //Inladen segment 'doc.delivery.links'. Veldnaam is geconfigueerd via variabele 'field4'.
                    serv4 = doc.delivery[field4];
                    //console.log(serv4);

                    serv4.forEach(link => {
                        if ((link["linkType"] == type) && link["linkURL"].match(linkSign)) {
                            var linkData = window.linksServiceRewrite.getUrlAndLabel(link["linkURL"])
                            link.linkURL = linkData[0];
                            if (linkData[1].match('Lirias')) {
                                link.displayLabel = link.displayLabel + " - Lirias";
                            }
                            else {
                                link.displayLabel = link.displayLabel + " - External source";
                            }
                        }
                    });
                    console.log("End section 4")
                }
            }
            console.log(doc);
            return doc;
        }
    }
}
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
    })


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

