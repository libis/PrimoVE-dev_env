const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.passwordHack = {
    active: true,
    activate: () => {
        passwordHack.active = true
    },
    init: (url, headers, params, data) => {
        console.log (" INIT passwordHack");
    },
    removePasswordLinks(links) {       
        var links = links.filter( l => {
            return ! ( 
                l.linkType == 'addlink' &&
                /test/.test(l.displayLabel) && 
                /hidden/.test( l.publicNote) &&
                /www.kuleuven.be/.test(l.linkURL) 
            )
        });
        return links;
    }
  
};

angular.module('passwordHack', ['ng']).run(() => {
    // https://libis-kul-psb.primo.exlibrisgroup.com/primaws/rest/pub/edelivery/alma9992368054301488?vid=32KUL_KUL:KULeuven&lang=en&googleScholar=false&lang=en
    // link[0].displayLabel
    pubSub.subscribe('after-prepareElectorincRTA', (url, headers, params, data) => {
        let links = data.link;
        if (links) {
            data['link'] = passwordHack.removePasswordLinks(links);
        }
        return data;
    })
    pubSub.subscribe('after-calculatePhysicalServiceId', (url, headers, params, data) => {
        let links = data.link;
        if (links) {
            data['link'] = passwordHack.removePasswordLinks(links);
        }
        return data;
    })


});