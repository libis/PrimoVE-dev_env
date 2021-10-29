import Component from '../core/angular/component';

export default class Facets {
    constructor() {        
        try {
            let facets = Component.controller('prm-facet');
            if (facets) {
                return facets.facets;
            }
            return {};
        } catch(e) {
            return []
        }
    }
}