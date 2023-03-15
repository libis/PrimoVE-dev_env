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

                        //if (m.pnx.control.sourceid.filter(s => ['lirias'].includes(s)).length > 0) {
                            m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;
                        
                            m.delivery.availability = m.pnx.delivery.fulltext;
                            m.delivery.deliveryCategory = m.pnx.delivery.delcategory;
                            m.delivery.displayedAvailability = m.pnx.delivery.fulltext[0];
                        //}

                        //if (m.pnx.control.sourceid.filter(s => ['ESVLP_scopeArchiv'].includes(s)).length > 0) {
                        //    m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;
                        //    // m.delivery.availability = m.pnx.delivery.fulltext == null ? ["ScopeArchiv_free"]:m.pnx.delivery.fulltext;

                        //    m.delivery.deliveryCategory = m.pnx.delivery.delcategory;
                        //    if (m.delivery.deliveryCategory == 'Remote Search Resource') {
                        //        m.delivery.availability = ['available_vlp'];
                        //        m.delivery.displayedAvailability = ['available_vlp'];
                        //    }

                        //    if (m.delivery.deliveryCategory == 'Online Resource') {
                        //        m.delivery.availability = ['scopearchiv_free'];
                        //        m.delivery.displayedAvailability = ['scopearchiv_free'];
                        //    }

                        //    //m.delivery.displayedAvailability = m.pnx.delivery.fulltext == null ? 'No full text' : m.pnx.delivery.fulltext[0];
                        //}
                        
                    }
                } catch (error) {
                    console.error(`No thumbnail for record:${m.pnx.control.recordid}`);
                    //console.error(error);
                }
            });        
        }
 //   }
    return reqRes
});