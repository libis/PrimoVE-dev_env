// delivery:
// additionalLocations: false
// availability: ['no_inventory']
// deliveryCategory: ['Alma-P']
// displayLocation: false
// displayedAvailability: "no_inventory"
// link: [{…}]
// physicalItemTextCodes: ""
pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    //console.log(reqRes);
//    if (Object.keys(reqRes.config.params).includes('blendFacetsSeparately')) {        
        if (reqRes.data.docs) {
            reqRes.data.docs.map((m) => {
                try {                
                    if (m.adaptor === 'SearchWebhook') {      

                        //if (m.pnx.control.sourceid.filter(function(s) {
                        //        return ['lirias'].includes(s);
                        //    }).length > 0) {
                        //console.log(m)
                            m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;
                        
                        m.delivery.availability = m.pnx.delivery.fulltext;
                        if (m.pnx.delivery.fulltext == 'fulltext_linktorsrc') {
                            m.delivery.deliveryCategory = m.pnx.delivery.delcategory;
                        }
                            m.delivery.displayedAvailability = m.pnx.delivery.fulltext[0];

                        //console.log(m)
                        }

                        //if (m.pnx.control.sourceid.filter(function(s) {
                        //        return ['ESVLP_scopeArchiv','esvlp_archief'].includes(s);
                        //    }).length > 0) {
                        //    //console.log(m)

                        //    m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;

                        //    m.delivery.availability = m.pnx.delivery.fulltext;
                        //    m.delivery.deliveryCategory = m.pnx.delivery.delcategory;
                        //    m.delivery.displayedAvailability = m.pnx.delivery.fulltext[0];

                        //}
                        
                    //}
                } catch (error) {
                    console.error(`No thumbnail for record:${m.pnx.control.recordid}`);
                    //console.error(error);
                }
            });        
        }
 //   }
    return reqRes
});