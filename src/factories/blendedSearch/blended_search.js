const syncFetch = require('sync-fetch');

window.blendedSearch = {
    active: false,
    result: {},
    params: {},
    get limit() { return Math.floor(blendedSearch.params.limit / 2) },
    get offset() { return Math.floor(blendedSearch.params.offset / 2) },
    activate: () => {
        let windowParams = window.location.search.slice(1).split('&').map(m => m.split('=')).reduce((map, obj) => { map[obj[0]] = obj[1]; return map }, {})
        if (windowParams.hasOwnProperty('blend')) {
            let active = windowParams.blend == 1;
            if (blendedSearch.active != active) {
                blendedSearch.active = active
                console.log('blendedSearch state change isActive:', blendedSearch.active);
            }
        }
    },
    search: (url, headers, params) => {
        blendedSearch.result = {};
        // clone and prepare parameters
        let cloned_params = JSON.parse(JSON.stringify(params));
        cloned_params['scope'] = 'lirias_profile';
        cloned_params['pcAvailability'] = true;

        let esURL = new URL(`${window.location.origin}${url}`);
        Object.keys(cloned_params).forEach(key => {
            if (cloned_params[key] != undefined) {
                esURL.searchParams.append(key, cloned_params[key])
            }
        });

        //fetch result
        result = syncFetch(esURL, { method: 'GET', headers: headers }).json();
        blendedSearch.result = result;
        
        return result;
    }
};

angular.module('blendedSearch', ['ng']).run(() => {

    pubSub.subscribe('before-pnxBaseURL', (url, headers, params, data) => {
        blendedSearch.params = params;

        data.params.limit = blendedSearch.limit;
        data.params.offset = blendedSearch.offset;
        return data;
    })

    // federated search and merge result set
    pubSub.subscribe('after-pnxBaseURL', (url, headers, params, data) => {
        if (params['scope'] == 'lirias_profile') {
            console.log('==============>', JSON.stringify(params))
        } else {
            let result = blendedSearch.search(url, headers, params);
            console.log('BLENDING ResultSet1:', JSON.stringify(data.info));
            console.log('BLENDING ResultSet2:', JSON.stringify(result.info));

            //process result 
            let newLimitSet1 = data.docs.length < params.limit ? data.docs.length : params.limit
            let newLimitSet2 = result.docs.length < params.limit ? result.docs.length : params.limit;

            let docs = [];
            docs = data.docs.slice(0, newLimitSet1);
            docs = docs.concat(result.docs.slice(0, newLimitSet2));

            let rankSet1 = 1;
            try {
                rankSet1 = data.docs[0].pnx.control.score;
            } catch (error) {
                rankSet1 = 0;
            }

            let rankSet2 = 1;
            try {
                rankSet2 = result.docs[0].rank;
            } catch (error) {
                rankSet2 = 1;
            }

            docs = docs.map(m => {
                if (m.hasOwnProperty('rank')) {
                    m.pnx.control['score'] = (m.rank / rankSet2) * rankSet1;
                }
                return m;
            })

            docs = docs.sort((a, b) => b.pnx.control.score - a.pnx.control.score);

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