import searchAlsoBodyHTML from './searchAlsoBody.html'
import Session from '../../primo/session'

class SearchAlsoBodyController {
  constructor($location) {
    this.$location = $location;
  }

  $onInit() {
    let self = this;
    let view = Session.view;
    self.viewCode = view.code;      
    self.targets = self._targets();    
    
    this.location = this.$location;
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
            "view": '^32KUL_KATHO:VIVES|^32KUL_HUB:ODISEE|^FARO|^32KUL_KHK:TMOREK|^32KUL_KHM:TMOREMA|^32KUL_KHL:UCLL|^32KUL_VLER.*',       
        "name": "Google Scholar",
        "url": "https://scholar.google.com/scholar?q=",
        "img": "https://scholar.google.com/favicon.ico",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.google_scolar",
        mapping: function mapping(search) {
          var terms = search.split(",");
          return terms[2] || "";
        }
      },
      {
          "view": '^32KUL_KATHO:VIVES|^FARO|^32KUL_KHL:UCLL|^32KUL_LUCAWENK:LUCA|^32KUL_VLER.*',
        "name": "UniCat",
        "url": "https://unicat.be/uniCat?func=search&uiLanguage=en&query=",
        "img": "/discovery/custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/favicon_unicat.ico",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.unicat",
        mapping: function mapping(search) {
          var terms = search.split(",");
          return terms[2] || "";
        }
      },
      {
        "view": '^32KUL_KUL:KULeuven',
        "name": "UniCat",
        "url": "https://kuleuven.e-bronnen.be/login?url=https://unicat.be/uniCat?func=search&uiLanguage=en&query=",
        "img": "/discovery/custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/favicon_unicat.ico",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.unicat",
        mapping: function mapping(search) {
          var terms = search.split(",");
          return terms[2] || "";
        }
      },
      {
        "view": '^32KUL_VLP:Archief',
        "name": "Parlementair Informatiecentrum",
        "url": "https://libis-vlp.primo.exlibrisgroup.com/discovery/search?vid=32KUL_VLP:VLP&query=any,contains,",
        "img": "/discovery/custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/favicon.ico",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.vlp",
        mapping: function mapping(search) {
          var terms = search.split(",");
          return terms[2] || "";
        }
      },
       {
        "view": '^FARO|^32KUL_KUL:KULeuven',
        "name": "Worldcat",
        "url": "https://www.worldcat.org/search?q=",
        "img": "/discovery/custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/favicon_worldcat.ico",
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
      }, {
        "view": '^32KUL_KATHO:VIVES|^32KUL_HUB:ODISEE|^FARO|^32KUL_KHK:TMOREK|^32KUL_KHM:TMOREMA|^32KUL_KHL:UCLL|^32KUL_LUCAWENK:LUCA|^32KUL_DOCVB:docvlaamsbrabant',
        "name": "Bibliotheek.be",
        "url": "https://www.bibliotheek.be/catalogus?q=",
        "img": "/discovery/custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/bib_be.png",
        "tooltip": "nui.customizing.idslu.search_also.tooltip.deBib",
        mapping: function mapping(search) {
          var terms = search.split(",");
          return terms[2] || "";
        }
      }
    ].filter(f => new RegExp(f.view).test(self.viewCode));
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
  enabled: true,
  appendTo: 'prm-facet-exact-after',
    enableInView: '^32KUL_KATHO:VIVES|^32KUL_VLP:Archief|^32KUL_HUB:ODISEE|^FARO|^32KUL_KHK:TMOREK|^32KUL_KHM:TMOREMA|^32KUL_KHL:UCLL|^32KUL_KUL:KULeuven|^32KUL_LUCAWENK:LUCA|^32KUL_DOCVB:docvlaamsbrabant|^32KUL_VLER.*'
}
