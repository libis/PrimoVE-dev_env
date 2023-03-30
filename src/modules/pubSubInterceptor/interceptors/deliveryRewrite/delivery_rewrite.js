window.deliveryRewrite = {
    active: true,
    configuration: {
        aftercalculatePcDelivery: [
            {
                enableInView: '32KUL_VLP:.*',
                deliveryRewrite:  { source: "ESVLP_scopeArchiv" }
            }
        ],
    },

    deliveryRewrite: ({ delivery = {},  pnx = {}, source = null }) => {
      
        if ( pnx.control.sourceid.includes( source ) ) {
            delivery.link = delivery.link == null ? [] : delivery.link;
            delivery.availability = pnx.delivery.fulltext;
            //delivery.deliveryCategory = pnx.delivery.delcategory;
            delivery.displayedAvailability = pnx.delivery.fulltext[0];    
        }

        return delivery;

    }

};


pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {

    var rewriteActions = deliveryRewrite.configuration.aftercalculatePcDelivery.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    })

    if (rewriteActions.length > 0) {
        rewriteActions.forEach(rewriteAction => {
            delete rewriteAction.enableInView;
            // console.log(rewriteAction);
            Object.entries(rewriteAction).forEach(ra => {
                const [action, parameters] = ra;
                // console.log(action, parameters);
                if (reqRes.data.delivery !== undefined) {
                    parameters.delivery = reqRes.data.delivery
                    parameters.pnx = reqRes.config.data.doc.pnx
                    reqRes.data.delivery = deliveryRewrite[action](parameters);
                }
            });
        });
    }
    return reqRes;
})
