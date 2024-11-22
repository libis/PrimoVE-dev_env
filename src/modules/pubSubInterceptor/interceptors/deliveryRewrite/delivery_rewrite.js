window.deliveryRewrite = {
    active: true,
    configuration: {
        aftercalculatePcDelivery: [
             {
                enableInView: '32KUL_KUL:Lirias',
                excludeDelivery:  { field: "availability", value: "check_holdings" }
            },
            /*
            {
                enableInView: '32KUL_KUL:Lirias',
                filterDelivery:  { field: "availability", value: "check_holdings" }
            },
            */
            {
                enableInView: '32KUL_VLP:.*',
                copyFromPnx:  { source: "esvlp_archief" }
            }
        ]
    },
    copyFromPnx: ({ delivery = {},  pnx = {}, source = null }) => {
      
        if ((pnx.control.sourceid.includes(source)) || (pnx.control.sourceid.includes('ESVLP_scopeArchiv'))) {
            delivery.link = delivery.link == null ? [] : delivery.link;
            delivery.availability = pnx.delivery.fulltext;
            delivery.displayedAvailability = pnx.delivery.fulltext[0];    
        }
        return delivery;
    },

    filterDelivery: ({ delivery = {},  pnx = {}, field = null,  value = null}) => {
        var filter = value
        // console.log ( filter )
        delivery[field] = delivery[field].filter(function (value, index, arr) {
            console.log ( filter )
            return value !== filter;
        });
        return delivery;
    },

    excludeDelivery: ({ delivery = {},  pnx = {}, field = null,  value = null}) => {
        var filter = value
         delivery[field] = delivery[field].filter(function (value, index, arr) {
            // console.log ( filter )
            return value !== filter;
        });
        return delivery;
    }
};


pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {

    var rewriteActions = deliveryRewrite.configuration.aftercalculatePcDelivery.filter(c => {
        return new RegExp(c.enableInView).test(window.appConfig.vid)
    });

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


/*
pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {

    enableInView = '32KUL_KUL:Lirias';
    if (new RegExp(enableInView).test(window.appConfig.vid)) {
        reqRes.data.delivery.availability = reqRes.data.delivery.availability.filter(function (value, index, arr) {
            return value !== "check_holdings";
        });
    }
    return reqRes;
})
*/