import searchAlsoBodyHTML from './searchAlsoBody.html'

class SearchAlsoBodyController {
  constructor($location) {
    let self = this;
    Primo.view.then(v => {
      self.viewCode = v.code;      
      self.targets = self._targets();    
    });
    this.location = $location;
  }

  get search() {
    return this.location.search().query || '';
  }

  get name() {
    return this.parentCtrl.parentCtrl.facetGroup.name;
  }

  get parsedQuery() {
    let query = this.search;
    if (!Array.isArray(query)) {
      query = [query]
    }
    return query.map(m => m.split(','));
  }

  get searchTerms() {    
    let search = this.parsedQuery.map(m => `query=${m[0]},${m[1]},${m[2]}` || '').join('&');
    if (this.parsedQuery.length > 1) {
      search += '&mode=advanced';
    }

    return search;
  }

  _targets() {
    let self = this;

    return [
      {
        "view": "41SLSP_RZS:VU15",
        "name": "swisscovery RZS",
        "url": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/search?&tab=41SLSP_RZS_MyInst_and_CI&search_scope=MyInst_and_CI&vid=41SLSP_RZS:VU15&",
        "img": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/custom/41SLSP_RZS-VU15/img/favicon_everything_view.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.swisscovery-rzs",
        mapping: function mapping(search) {
          return self.searchTerms;
        }
      },
      {
        "view": "41SLSP_RZS:VU06",
        "name": "swisscovery RZS - HSLU",
        "url": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/search?&tab=41SLSP_RZS_MyInst_and_CI&search_scope=MyInst_and_CI&vid=41SLSP_RZS:VU06&",
        "img": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/custom/41SLSP_RZS-VU15/img/favicon_hslu_view.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.swisscovery-rzs-hslu",
        mapping: function mapping(search) {
          return self.searchTerms;
        }
      },
      {
        "view": "41SLSP_RZS:VU07",
        "name": "swisscovery RZS - ZHB/Uni/PH",
        "url": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/search?&tab=41SLSP_RZS_MyInst_and_CI&search_scope=MyInst_and_CI&vid=41SLSP_RZS:VU07&",
        "img": "https://slsp-rzs.primo.exlibrisgroup.com/discovery/custom/41SLSP_RZS-VU15/img/favicon_zhb_view.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.swisscovery-rzs-zhbuniph",
        mapping: function mapping(search) {
          return self.searchTerms;
        }
      }, {
        "view": "41SLSP_NETWORK:VU1_UNION",
        "name": "swisscovery",
        "url": "https://slsp-network.primo.exlibrisgroup.com/discovery/search?&tab=41SLSP_NETWORK&search_scope=DN_and_CI&vid=41SLSP_NETWORK:VU1_UNION&",
        "img": "https://slsp-network.primo.exlibrisgroup.com/discovery/custom/41SLSP_RZS-VU15/img/favicon_swisscovery.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.swisscovery",
        mapping: function mapping(search) {
          return self.searchTerms;
        }
      }, {
        "view": "*",
        "name": "Google Scholar",
        "url": "https://scholar.google.com/scholar?q=",
        "img": "https://scholar.google.com/favicon.ico",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.google_scolar",
        mapping: function mapping(search) {
          return self.searchTerms;
        }
      }, {
        "view": "*",
        "name": "Worldcat",
        "url": "https://www.worldcat.org/search?q=",
        "img": "https://slsp-network.primo.exlibrisgroup.com/discovery/custom/41SLSP_RZS-VU15/img/favicon_worldcat.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.worldcat",
        mapping: function mapping(search) {
          var type_mappings = {
            "any": "kw",
            "title": "ti",
            "creator": "au",
            "subject": "su"
          };

          return self.parsedQuery.map(m => `${type_mappings[m[0]] || "kw"}:${m[2] || ''}`).join(' ');
        }
      }].filter(f => f.view != self.viewCode);
  }
}

SearchAlsoBodyController.$inject = ['$location'];


export let searchAlsoBodyComponent = {
  name: 'custom-search-also-body',
  config: {
    bindings: { parentCtrl: '<' },
    controller: SearchAlsoBodyController,
    template: searchAlsoBodyHTML
  },
  enabled: false,
  appendTo: 'prm-facet-exact-after',
  enableInView: '.*'
}
