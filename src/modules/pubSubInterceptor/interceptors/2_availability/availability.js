// delivery:
// additionalLocations: false
// availability: ['no_inventory']
// deliveryCategory: ['Alma-P']
// displayLocation: false
// displayedAvailability: "no_inventory"
// link: [{…}]
// physicalItemTextCodes: ""
pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    console.log(reqRes);
//    if (Object.keys(reqRes.config.params).includes('blendFacetsSeparately')) {        
        reqRes.data.docs.map((m) => {
            try {                
                if (m.adaptor === 'SearchWebhook') {      
                                  
                    m.delivery.link = m.delivery.link == null ? [] : m.delivery.link;
                    
                    m.delivery.availability = m.pnx.delivery.fulltext;
                    m.delivery.deliveryCategory = m.pnx.delivery.delcategory;
                    m.delivery.displayedAvailability = m.pnx.delivery.fulltext[0];
                }
            } catch (error) {
                console.error(`No thumbnail for record:${m.pnx.control.recordid}`);
            }
        });        
 //   }
    return reqRes
});