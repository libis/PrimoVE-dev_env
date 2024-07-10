
export default class ProxyService {
    constructor() {
  
    }
  
    config() {
      let self = this;
      return [
       {
          "view": '^32KUL_KATHO:.*',       
          "name": "EZproxy VIVES",
          "url": "https://vives.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        },
        {
          "view": '^32KUL_HUB.*',       
          "name": "EZproxy UCCL",
          "url": "https://odisee.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        },
        {
          "view": '^32KUL_KHK:.*',       
          "name": "EZproxy Thomas More Kempen",
          "url": "https://k.thomasmore.e-bronnen.be.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        },
  
        {
          "view": '^32KUL_KHM:TMOREMA',       
          "name": "EZproxy Thomas More Mechelen-Antwerpen",
          "url": "https://am.thomasmore.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        },
        {
          "view": '^32KUL_KHL:.*',       
          "name": "EZproxy UCCL",
          "url": "https://ucll.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        },
        {
          "view": '^32KUL_KUL:.*',       
          "name": "EZproxy KU Leuven",
          "url": "https://kuleuven.e-bronnen.be/login?url=",
          "img": "https://limo.libis.be/favicon.ico",
          "tooltip": ""
        }
      ]
    }
  }
  
  ProxyService.$inject = [];
  
  angular.module('proxy', ['ng']).service('ProxyService', ProxyService);