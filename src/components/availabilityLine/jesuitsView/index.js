class AvailabilityLineController {
  constructor($scope, $translate) {
    let self = this;

    self.almaInstitutionsFilterInstCodeList = ["32KUL_KUL", "32KUL_KADOC"]

    self.$scope = $scope;
    self.$translate = $translate;
    self.$ctrl = self.parentCtrl.parentCtrl;
    self.$scope.$ctrl = self.parentCtrl.parentCtrl;


    console.log("AvailabilityLineController")
    console.log(self)
    console.log( self.$ctrl.result )


    self.$scope.$ctrl.getPlaceHolders = function () {
      return self.$scope.$ctrl.placeHolders;
    }

    /*
    console.log ( self.$ctrl.result.delivery.almaInstitutionsList )
    console.log ( self.$ctrl)
    console.log ( "displayedAvailability:"+ self.$ctrl.displayedAvailability );
    console.log ( "delivery.displayedAvailability:"+ self.$ctrl.result.delivery.displayedAvailability)
    console.log ( "delivery.availability:"+self.$ctrl.result.delivery.availability[0] );
    */

    self.$ctrl.displayedAvailability.forEach(availability => {
      /*
      console.log(" showOtherLibraries(availability) " + self.$ctrl.showOtherLibraries(availability))
      console.log(" showDisplayOtherLocations() " + self.$ctrl.showDisplayOtherLocations())
      console.log(" showDisplayLocation()" + self.$ctrl.showDisplayLocation())
      console.log(" getCoverage()" + self.$ctrl.getCoverage())
      */
      self.$ctrl.showOtherLibraries = function () { false }
      self.$ctrl.showDisplayOtherLocations = function () { false }

      /*
      console.log ( "ifShowAvailability(availability):"+ self.$ctrl.ifShowAvailability(availability) );
      console.log ( "!$ctrl.isCollectionDiscoveryCollection:"+ self.$ctrl.isCollectionDiscoveryCollection );
      console.log ( "$ctrl.showTimer:"+ self.$ctrl.showTimer);
      console.log ( "$ctrl.handleDueDate(availability):"+ self.$ctrl.handleDueDate(availability) );
      console.log ( "$ctrl.isPhysical():"+ self.$ctrl.isPhysical());
      console.log ( "$translate.instant('delivery.code.available_in_library') :"+ $translate.instant('delivery.code.'+ self.$ctrl.handleDueDate(availability) )  );
      console.log (  $translate.instant('delivery.code.'+ self.$ctrl.handleDueDate(availability) )  );
      */
      // ng-if="::($ctrl.showDisplayOtherLocations() || $ctrl.showDisplayLocation()  || $ctrl.showOtherLibraries(availability)) && $ctrl.isPhysical($index)"
      var availabilityInstitutions = []
      if (self.$ctrl.result.delivery.almaInstitutionsList) {
        availabilityInstitutions = self.$ctrl.result.delivery.almaInstitutionsList.filter(inst => {
          return (inst.availabilityStatus === "available_in_institution" && self.almaInstitutionsFilterInstCodeList.includes(inst.instCode))
        })
      }
      
      var availabilityInstitutionsNames = availabilityInstitutions.map(inst => inst.instName)

      if (self.$ctrl.result.delivery.availability[0] === "available_in_library") {
        if (self.$ctrl.result.delivery.displayedAvailability === "available_in_library" || self.$ctrl.result.delivery.displayedAvailability === null ) {
          availabilityInstitutionsNames.unshift(window.appConfig["primo-view"].institution.description);
        }
        if (availabilityInstitutionsNames.length > 0) {
          // replace instname from availabilityText with list of instnames
          if (availabilityInstitutionsNames.length === 1) {
            self.$ctrl.placeHolders = {
              idx_0: "AvailabilityLineController TEST0",
              idx_1: availabilityInstitutionsNames[0],
              idx_2: "AvailabilityLineController TEST2"
            }
          } else {

            self.$ctrl.placeHolders = {
              idx_0: "AvailabilityLineController TEST0",
              idx_1: availabilityInstitutionsNames.slice(0, -1).join(', ') + ' and ' + availabilityInstitutionsNames.slice(-1),
              idx_2: "AvailabilityLineController TEST2"
            }
          }
        }
      }


      
      // if (self.$ctrl.result.delivery.bestlocation === null) {
      if (self.$ctrl.result.delivery.availability[0] === "no_inventory") {
        self.$ctrl.result.delivery.availability = ["available_in_library"];
        if (availabilityInstitutionsNames.length > 0) {
          if (availabilityInstitutionsNames.length === 1) {
            self.$ctrl.placeHolders = {
              idx_0: "AvailabilityLineController TEST0",
              idx_1: availabilityInstitutionsNames[0],
              idx_2: "AvailabilityLineController TEST2"
            }
          } else {
            self.$ctrl.placeHolders = {
              idx_0: "AvailabilityLineController TEST0",
              idx_1: availabilityInstitutionsNames.slice(0, -1).join(', ') + ' and ' + availabilityInstitutionsNames.slice(-1),
              idx_2: "AvailabilityLineController TEST2"
            }
          }
        }
      }
    });
  }
}

AvailabilityLineController.$inject = ['$scope', '$translate'];

export let availabilityLineLocationsForKULeuvenRegionalViewwConfig = {
  name: 'custom-availability-line-regional-view',
  enabled: true,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KUL:JESUITS,32KUL_LIBIS_NETWORK:JESUITS_UNION',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: AvailabilityLineController,
    template: ''
  }
}
