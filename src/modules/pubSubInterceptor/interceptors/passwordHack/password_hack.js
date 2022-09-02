window.passwordHack = {
    active: true,
    activate: () => {
        passwordHack.active = true
    },
    init: (reqRes) => {
        console.log(" INIT passwordHack");
    },
    removePasswordLinks(links) {
        var links = links.filter(l => {
            // console.log (l)
            return !(
                (
                    l.linkType == 'addlink' &&
                    /test/i.test(l.displayLabel) &&
                    /hidden/i.test(l.publicNote) &&
                    /www.kuleuven.be/.test(l.linkURL) 
                ) 
                ||
                (
                    l.linkType == 'addlink' &&
                    /www.kuleuven.be/.test(l.linkURL) &&
                    l.displayLabel == 'Test please ignore'
                )
            )
        });
        return links;
    }

};

//angular.module('passwordHack', ['ng']).run(() => {
    // https://libis-kul-psb.primo.exlibrisgroup.com/primaws/rest/pub/edelivery/alma9992368054301488?vid=32KUL_KUL:KULeuven&lang=en&googleScholar=false&lang=en
    // link[0].displayLabel
   // document.addEventListener('pubSubInterceptorsReady', (e) => {

        pubSub.subscribe('after-prepareElectorincRTA', (reqRes) => {
            if ( reqRes.data['link'] ) {
                let links = reqRes.data['link'];
                if (links) {
                    reqRes.data['link'] = passwordHack.removePasswordLinks(links);
                }
            }else{
                reqRes.data = Object.keys(reqRes.data).map(key => {
                    if ( ! key.match(/^beacon.*/) ){
                        if ( reqRes.data[key]['link'] ) {
                            let links = reqRes.data[key]['link'] ;
                            if (links) {
                                reqRes.data[key]['link'] = passwordHack.removePasswordLinks(links);
                            }
                        }
                    } 
                    return {[key]: reqRes.data[key]};
                  });
              }
            return reqRes;
        })

        pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {
//            console.log ("TEST after-calculatePcDelivery")
            let links = reqRes.data.delivery.link;
            if (links) {
                reqRes.data.delivery.link = passwordHack.removePasswordLinks(links);
            }
            return reqRes;
        })

        pubSub.subscribe('after-calculatePhysicalServiceId', (reqRes) => {
//            console.log ("TEST after-calculatePhysicalServiceId")
            let links = reqRes.data.link;
            if (links) {
                reqRes.data['link'] = passwordHack.removePasswordLinks(links);
            }
            return reqRes;
        })

   // });
//});