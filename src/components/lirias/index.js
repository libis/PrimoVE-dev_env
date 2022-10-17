import liriasHTML from './lirias.html'

class LiriasController {
    constructor($location) {
        let self = this;
        self.location=$location;
        self.total = 0;
        self.url = '';
    }


    $onInit() {
        let self = this;
        self.total = 0;
        self.url = '';
        document.addEventListener('liriasResult.local', (event) => {
            self.total = event.detail.result.total;
            self.url = event.detail.result.url.href;            
        })        
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

LiriasController.$inject= ['$location'];

export let liriasComponent = {
  name: 'custom-lirias',
  config: {
    bindings: { parentCtrl: '<' },
    controller: LiriasController,
    template: liriasHTML
  },
  enabled: true,
  appendTo: 'prm-resource-recommender-after',
  enableInView: '.*'
}