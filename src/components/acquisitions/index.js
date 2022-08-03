import acquisitionsnlBEHTML from './acquisitionsnlBE.html'

class AcquisitionsController {
  constructor($scope) {
    var self = this;
    var vid = window.appConfig['vid'];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var current_month = month;
    var current_year = year;
    if(month - 1 == 0){
      month = 12;
      year = year - 1;
    }else{
      month = month - 1;
    }
    month = ("0" + month).slice(-2);
    current_month = ("0" + current_month).slice(-2);
    console.log("Current month is: " + month);

    $scope.url = window.location.origin + "/discovery/search?query=any,contains,acquisitionDate" + year + month + "DOCVB* OR acquisitionDate" + current_year + current_month + "DOCVB*,AND&tab=phys_items_tab&search_scope=PHYS_ITEMS&vid="+ vid + "&lang=nl_BE&mode=advanced&offset=0;"
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

