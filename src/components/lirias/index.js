import liriasHTML from './lirias.html'
import './lirias.css'

class LiriasController {
    constructor() {
        let self = this;
    }

    get total() {
        try {
            return blendedSearch.set2.data.info.total;
        }
        catch(e) {
            return 0;
        }        
    }

    goLirias() {
        let self = this;
    
        let lirias = new URL(document.location.href);
        lirias.host = 'kuleuven.limo.libis.be';
        lirias.protocol='https:';
        lirias.port='443';
        lirias.searchParams.set('tab', 'LIRIAS');
        lirias.searchParams.set('search_scope', 'lirias_profile');
        lirias.searchParams.set('vid', '32KUL_KUL:Lirias');
        lirias.searchParams.set('offset', '0');

        window.open(lirias.href, '_blank');
    }
}

export let liriasComponent = {
  name: 'custom-lirias',
  config: {
    bindings: { parentCtrl: '<' },
    controller: LiriasController,
    template: liriasHTML
  },
  enabled: true,
  appendTo: 'prm-search-result-tool-bar-after',
  enableInView: '.*'
}