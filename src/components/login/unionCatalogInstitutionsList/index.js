/****************************************************************************************/
/*  List of availabilityInstitutions can configured for each view in "View Labels"      */
/* nui.customization.almaInstitutionsFilterInstCodeList contains a comma seperated list */
/* of the institutions code that may appear in the login screen                         */
/* 32KUL_LIBIS_NETWORK:DOKS_UNION.nui.customization.almaInstitutionsFilterInstCodeList  */
/****************************************************************************************/

class UnionCatalogInstitutionsListController {
  constructor($scope, $translate)  {
    let self = this;
    let parentCtrl = self.parentCtrl.parentCtrl


    $translate.instant('nui.customization.almaInstitutionsFilterInstCodeList').split(',')

    self.almaInstitutionsFilterInstCodeList = $translate.instant('nui.customization.almaInstitutionsFilterInstCodeList').split(',')

    var availabilityInstitutions = parentCtrl.unionCatalogInstitutionsList.filter(inst => {
      console.log (inst)
      return ( self.almaInstitutionsFilterInstCodeList.includes(inst.code) )
    })

    parentCtrl._unionCatalogInstitutionsList = availabilityInstitutions;

  }
}

UnionCatalogInstitutionsListController.$inject = ['$scope','$translate'];

export let unionCatalogInstitutionsListComponent = {
  name: 'custom-union-catalog-login',
  config: {
    bindings: { parentCtrl: '<' },
    controller: UnionCatalogInstitutionsListController,
    template: ''
  },
  enabled: true,
  appendTo: ['prm-union-catalog-login-after'],
  enableInView: '.*'
}

