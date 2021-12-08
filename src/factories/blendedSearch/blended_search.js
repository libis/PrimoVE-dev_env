const syncFetch = require('sync-fetch');

         
angular.module('blendedSearch', ['ng']).run(() => {

    pubSub.subscribe('before-pnxBaseURL', (url, headers, params, data) => {                
        data.params.limit = Math.floor(data.params.limit/2);
        data.params.offset = Math.floor(data.params.offset/2);
        return data;
    })

    // federated search and merge result set
    pubSub.subscribe('after-pnxBaseURL', (url, headers, params, data) => {
        if (params['scope'] == 'lirias_profile') {
            console.log('==============>', JSON.stringify(params))
        } else {
            let cloned_params = JSON.parse(JSON.stringify(params));
            cloned_params['scope'] = 'lirias_profile';
            cloned_params['pcAvailability'] = true;

            let esURL = new URL(`${window.location.origin}${url}`);
            Object.keys(cloned_params).forEach(key => {
                if (cloned_params[key] != undefined) {
                    esURL.searchParams.append(key, cloned_params[key])
                }
            });

            result = syncFetch(esURL, { method: 'GET', headers: headers }).json();

            let newLimitSet1 = data.docs.length < cloned_params.limit ? data.docs.length : cloned_params.limit
            let newLimitSet2 = result.docs.length < cloned_params.limit ? result.docs.length : cloned_params.limit;
            
            let docs = [];
            docs = data.docs.slice(0, newLimitSet1);
            docs = docs.concat(result.docs.slice(0, newLimitSet2));

            let rankSet1 = data.docs[0].pnx.control.hasOwnProperty['score'] ? data.docs[0].pnx.control.score : 1;
            let rankSet2 = result.docs[0].hasOwnProperty('rank') ? result.docs[0].rank : 1;

            docs = docs.map(m => {
                if (m.hasOwnProperty('rank')) {
                    m.pnx.control['score'] = (m.rank / rankSet2) * rankSet1;
                }
                return m;
            })

            docs = docs.sort((a,b) => b.pnx.control.score - a.pnx.control.score);

            data['docs'] = docs;

        }
        return data;
    });

    // reverse titels
    // pubSub.subscribe('after-pnxBaseURL', function (url, headers, params, data) {
    //     data.docs.map(m => {
    //         //console.log(m); 
    //         m.pnx.display.title[0] = m.pnx.display.title[0].split('').reverse().join('');
    //         return m;
    //     });
    //     return data;
    // });    
})