class otherMembersController {
  constructor($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }

  $onInit() {
    let self = this;
    let itemDelivery = self.parentCtrl.parentCtrl.$scope.$parent.$parent.$parent.$ctrl.item.delivery;

    /*
    Alleen in eigen instelling
    http://localhost:8003/discovery/fulldisplay?docid=alma9925641190101488&context=L&vid=32KUL_KUL:LIBISNET2_UNION&lang=en&search_scope=DN_and_CI_UCV&adaptor=Local%20Search%20Engine&isFrbr=true&tab=DiscoveryNetwork_UCV&query=any,contains,wood&sortby=date_d&facet=frbrgroupid,include,9009075752282052547&offset=0
    http://localhost:8003/discovery/fulldisplay?docid=alma9992429289701488&context=L&vid=32KUL_KUL:LIBISNET2_UNION&lang=en&search_scope=DN_and_CI_UCV&adaptor=Local%20Search%20Engine&tab=DiscoveryNetwork_UCV&query=any,contains,wood&offset=0
    ====> Dan is er ook geen prm-alma-other-members-after element !!!
    ====> Deze controler zal dan niet worden uitgevoerd.
    
    => FRBR 
    https://libis-network.primo.exlibrisgroup.com/primaws/rest/priv/nz/pnx/P/9930070000101471?record-institution=32KUL_KUL&lang=en
    http://localhost:8003/primaws/rest/priv/nz/pnx/P/9930070000101488?record-institution=32KUL_KUL&lang=en
    
    
    Niet in eigen instelling
    http://localhost:8003/discovery/search?query=any,contains,9992170794501502&tab=DiscoveryNetwork_UCV&search_scope=DN_and_CI_UCV&vid=32KUL_KUL:LIBISNET2_UNION
    
    */

    if (itemDelivery.serviceMode.includes("ovp")) {
      self.removePrmOpac();
      self.addInstToAlmaInstitutionsList();
    }
    // console.log ( self.parentCtrl.parentCtrl.almaInstitutionsList )
    self.parentCtrl.parentCtrl.almaInstitutionsList.sort((a, b) => (a.instName > b.instName) ? 1 : -1);
  }

  addInstToAlmaInstitutionsList() {
    this.parentCtrl.parentCtrl.almaInstitutionsList.push(
      {
        "getitLink": [
          {
            "displayText": null,
            "linkRecordId": this.parentCtrl.parentCtrl.almaInstitutionsList[0].getitLink[0].linkRecordId
          }
        ],

        "instCode": window.appConfig["primo-view"].institution["institution-code"],
        "instName": window.appConfig["primo-view"].institution["institution-name"],
        "instId": window.appConfig["primo-view"].institution.id,
        "availabilityStatus": "available_in_institution",
      }
    );
  }

  removePrmOpac() {
    let unbindWatcher = this.$scope.$watch(() =>
      this.$element.parent().parent().parent().find('prm-opac'),
      (newVal, oldVal) => {
        //console.log (this);
        if (newVal) {
          newVal.find('md-tabs').remove();
          unbindWatcher();
        }
      }
    );
  }
}

otherMembersController.$inject = ['$scope', '$element'];

export let fullViewLocationsForKULeuvenRegionalViewwConfig = {
  name: 'custom-other-members-regional-view',
  enabled: true,
  appendTo: 'prm-alma-other-members-after',
  enableInView: '32KUL_KUL:REGIONAL',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: otherMembersController,
    template: ''
  }
}
