const { merge } = require('angular');
const syncFetch = require('sync-fetch');

window.blendedSearch = {
    active: false,
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
    init: (url, headers, params, data) => {
        blendedSearch.set1.url = url;
        blendedSearch.set1.headers = headers;
        blendedSearch.set1.params = JSON.parse(JSON.stringify(params));
        blendedSearch.set1.data = data;

        blendedSearch.set2.url = url;
        blendedSearch.set2.headers = headers;
        blendedSearch.set2.data = {};

        let cloned_params = JSON.parse(JSON.stringify(params));
        cloned_params['scope'] = 'lirias_profile';
        cloned_params['pcAvailability'] = true;
        blendedSearch.set2.params = cloned_params;
    },
    set1: {
        url: '',
        headers: {},
        params: {},
        data: {},
        get score() {
            let s = 1;
            try {
                s = blendedSearch.set1.data.docs[0].pnx.control.score;
            } catch (error) {
                s = 1;
            }

            return s;
        },
        get limit() {
            let data = blendedSearch.limitOffset()
            return data[0];
        },
        get offset() {
            let data = blendedSearch.limitOffset()
            return data[1];
        }
    },
    set2: {
        url: '',
        headers: {},
        params: {},
        data: { },
        get score() {
            let s = 1;
            try {
                s = blendedSearch.set2.data.docs[0].rank;
            } catch (error) {
                s = 1;
            }

            return s;
        },
        search: () => {
            blendedSearch.set2.data = {};

            let esURL = new URL(`${window.location.origin}${blendedSearch.set2.url}`);
            Object.keys(blendedSearch.set2.params).forEach(key => {
                if (blendedSearch.set2.params[key] != undefined) {
                    esURL.searchParams.append(key, blendedSearch.set2.params[key])
                }
            });

            //fetch result
            result = syncFetch(esURL, { method: 'GET', headers: blendedSearch.set2.headers }).json();
            blendedSearch.set2.data = result;

            return result;
        },
        get limit() {
            let data = blendedSearch.limitOffset()
            return data[2];
        },
        get offset() {
            let data = blendedSearch.limitOffset()
            return data[3];
        }
    },
    limitOffset() {
        let t1 = 0;
        let l1 = Math.ceil(this.set1.params.limit / 2);
        let o1 = Math.ceil(this.set1.params.offset / 2);

        let t2 = this.set2.data.info.total;
        let l2 = l1;
        let o2 = o1;

        if ((t2 - o2) < l2) {
            l2 = t2 - o2
            l2 = l2 < 0 ? 0 : l2 //compensate for o2 > t2
        }

        if (this.set2.data.docs.length < l2) {
            l2=this.set2.data.docs.length;
        }

        if (l2 < l1) {
            l1 = l1 + (l1 - l2)
        }

        return [l1, o1, l2, o2];
    },
    mergeFacets(facets) {
        let facetMap = this.set2.data.facets.reduce((map, obj) => { map[obj['name']] = obj; return map }, {});
        try {
            facets.forEach((v, i, a) => {
                //merge into facet
                if (facetMap.hasOwnProperty(v['name'])) {
                    let mergedFacet = v['values'].concat(facetMap[v['name']]['values']).reduce((map, obj) => {
                        if (map.hasOwnProperty(obj['value'])) {
                            map[obj['value']] += obj['count'];
                        } else {
                            map[obj['value']] = parseInt(obj['count']);
                        }
                        return map;
                    }, {});

                    let p = [];
                    //transform into object
                    Object.keys(mergedFacet).forEach(k => p.push({ 'value': k, 'count': mergedFacet[k] }))

                    v['values'] = p;
                }
            });
        } catch (e) {
            console.log(e);
        }

        return facets;        
    },
    mergeDocs() {
        let docs = [];
        if (blendedSearch.set1.data.docs) {
            docs =  docs.concat(blendedSearch.set1.data.docs.slice(0, blendedSearch.set1.limit));
        }
        if (blendedSearch.set2.data.docs) {
            docs =  docs.concat(blendedSearch.set2.data.docs.slice(0, blendedSearch.set1.limit));
        }

        let rankSet1 = blendedSearch.set1.score;
        let rankSet2 = blendedSearch.set2.score;

        docs = docs.map(m => {
            if (m.hasOwnProperty('rank')) {
                m.pnx.control['score'] = (m.rank / rankSet2) * rankSet1;
            }
            return m;
        })

        docs = docs.sort((a, b) => b.pnx.control.score - a.pnx.control.score);

        return docs
    }
};

angular.module('blendedSearch', ['ng']).run(() => {

    pubSub.subscribe('before-pnxBaseURL', (url, headers, params, data) => {
        blendedSearch.init(url, headers, params);
        blendedSearch.set2.search();

        data.params.limit = blendedSearch.set1.limit;
        data.params.offset = blendedSearch.set1.offset;
        return data;
    })

    // federated search and merge result set
    pubSub.subscribe('after-pnxBaseURL', (url, headers, params, data) => {
        if (params['scope'] != 'lirias_profile') {
            let result = blendedSearch.set2.data;
            blendedSearch.set1.data = JSON.parse(JSON.stringify(data));
            console.log('BLENDING ResultSet1:', JSON.stringify(data.info));
            console.log('BLENDING ResultSet2:', JSON.stringify(result.info));

            //process result 
            // DOCS
            if (result.info) {
                data['docs'] = blendedSearch.mergeDocs();
            }

            // FACETS
            let facets = data.facets;
            if (result.info) {
                if (facets) {
                    data['facets'] = blendedSearch.mergeFacets(facets);
                }
            }   

            if (result.info) {
                data['info']['total'] += result['info']['total'];
            }

            data

        }
        return data;
    });


    pubSub.subscribe('after-getFacetsBaseURL', (url, headers, params, data) => {
        let facets = data.facets;
        if (facets) {
            data['facets'] = blendedSearch.mergeFacets(facets);
        }

        return data;
    })

    // reverse titels
    // pubSub.subscribe('after-pnxBaseURL', function (url, headers, params, data) {
    //     data.docs.map(m => {
    //         //console.log(m); 
    //         m.pnx.display.title[0] = m.pnx.display.title[0].split('').reverse().join('');
    //         return m;
    //     });
    //     return data;
    // });    
});