class RemoveEShelfController {
  constructor($element) {

    var s = document.createElement("style");
    s.innerHTML = "prm-save-to-favorites-button { display: none !important }";
    s.innerHTML = s.innerHTML + "prm-add-query-to-saved-searches { display: none !important }"; 
    s.innerHTML = s.innerHTML + "a#favorites-button, prm-search-result-add-to-favorites-menu { display: none !important }"; 
    s.innerHTML = s.innerHTML + "prm-favorites  md-tabs { display: none !important }"; 

    $element.append(angular.element(s));
  

  }
}

RemoveEShelfController.$inject = ['$element'];

export let removeEShelfComponent = {
  name: 'custom-remove-e-shelf',  
  enabled: false,
  appendTo: 'prm-explore-main-after',
  enableInView: '32KUL_KUL.*|32KUL_KHL.*|32KUL_KHM.*|32KUL_KATHO.*',
  config: {
    bindings: {parentCtrl: '<'},
    controller: RemoveEShelfController,
    template: ''
  }
}
