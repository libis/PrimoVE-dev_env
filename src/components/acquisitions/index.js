import acquisitionsnlBEHTML from './acquisitionsnlBE.html'

class AcquisitionsController {
  constructor($scope) {
    let self = this;
    let vid = window.appConfig['vid'];
    
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let current_month = month;
    let current_year = year;
    if(month - 1 == 0){
      month = 12;
      year = year - 1;
    }else{
      month = month - 1;
    }
    month = ("0" + month).slice(-2);
    current_month = ("0" + current_month).slice(-2);
    // console.log("Current month is: " + month);
    $scope.vid = vid;

    Primo.view.then((view) => {
      //let vid = view.code;
      let locale = view.interfaceLanguage;
      $scope.lang = locale;
      
      if(vid == "32KUL_DOCVB:docvlaamsbrabant"){
        $scope.url = window.location.origin + "/discovery/search?query=any,contains,acquisitionDate" + year + month + "DOCVB* OR acquisitionDate" + current_year + current_month + "DOCVB*,AND&tab=phys_items_tab&search_scope=PHYS_ITEMS&vid="+ vid + "&lang=nl_BE&mode=advanced&offset=0;"
    
      }
      console.log(vid);
      if(vid == "32KUL_NBB:NBBMED"){
        let urls = {};
        year = now.getFullYear();
        month = now.getMonth() + 1;
        
        for (let i = 0; i < 4 ; i++){
          
          urls[year + "-" + ("0" + month).slice(-2)] = window.location.origin + "/discovery/search?query=any,contains,Acquisitiondate"+ year + month +"*&tab=LibraryCatalog&search_scope=NBBMED_PROFILE&vid=32KUL_NBB:NBBMED&offset=0&lang="+locale;
          if(month - 1 == 0){
            month = 12;
            year = year - 1;
          }else{
            month = month - 1;
          }
        };      
        console.log(urls);
        $scope.nbb_urls = urls;
      }
    });
  }
}

AcquisitionsController.$inject = ['$scope']

export let acquisitionsConfig = {
  name: 'prm-acquisition',
  enabled: true,
  appendTo: null,
  enableInView: '.*',
  config: {
    bindings: { parentCtrl: '<' },
    controller: AcquisitionsController,
    template:  acquisitionsnlBEHTML
  }
}

