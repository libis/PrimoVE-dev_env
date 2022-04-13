const { merge } = require('angular');
const syncFetch = require('sync-fetch');

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
            return !(
                l.linkType == 'addlink' &&
                /test/.test(l.displayLabel) &&
                /hidden/.test(l.publicNote) &&
                /www.kuleuven.be/.test(l.linkURL)
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
            let links = reqRes.data.link;
            if (links) {
                reqRes.data['link'] = passwordHack.removePasswordLinks(links);
            }
            return reqRes;
        })

        pubSub.subscribe('after-calculatePcDelivery', (reqRes) => {
            let links = reqRes.data.delivery.link;
            if (links) {
                reqRes.data.delivery.link = passwordHack.removePasswordLinks(links);
            }
            return reqRes;
        })

        pubSub.subscribe('after-calculatePhysicalServiceId', (reqRes) => {
            let links = reqRes.data.link;
            if (links) {
                reqRes.data['link'] = passwordHack.removePasswordLinks(links);
            }
            return reqRes;
        })
   // });
//});