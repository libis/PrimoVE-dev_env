class AvailabilityLineController {
  constructor($scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    let self = this;

    self.almaInstitutionsFilterInstCodeList = ["32KUL_HUB", "32KUL_KHM", "32KUL_KHK", "32KUL_KHL", "32KUL_LUCAWENK"]
    self.$ctrl = self.parentCtrl.parentCtrl;
    self.$scope.$ctrl = self.parentCtrl.parentCtrl;

/*
    console.log("AvailabilityLineController")
    console.log(self)
*/
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

      var availabilityInstitutions = [];
      if ( self.$ctrl.result.delivery.almaInstitutionsList) {
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
              idx_0: availabilityInstitutionsNames[0],
              idx_1: availabilityInstitutionsNames[0],
              idx_2: "AvailabilityLineController TEST2 [available_in_library] availabilityInstitutionsNames.length === 1"
            }
          } else {

            self.$ctrl.placeHolders = {
              idx_0: availabilityInstitutionsNames.slice(0, -1).join(', ') + ' and ' + availabilityInstitutionsNames.slice(-1),
              idx_1: availabilityInstitutionsNames.slice(0, -1).join(', ') + ' and ' + availabilityInstitutionsNames.slice(-1),
              idx_2: "AvailabilityLineController TEST2"
            }
          }
        }
      }


      
      // if (self.$ctrl.result.delivery.bestlocation === null) {
      if (availabilityInstitutionsNames.length > 0) {
        if (self.$ctrl.result.delivery.availability[0] === "no_inventory") {
          self.$ctrl.result.delivery.availability = ["available_in_library"];
          if (availabilityInstitutionsNames.length === 1) {
            self.$ctrl.placeHolders = {
              idx_0: availabilityInstitutionsNames[0],
              idx_1: availabilityInstitutionsNames[0],
              idx_2: "no_inventory AvailabilityLineController TEST2 availabilityInstitutionsNames.length === 1"
            }
          } else {
            self.$ctrl.placeHolders = {
              idx_0: availabilityInstitutionsNames.slice(0, -1).join(', ') + ' and ' + availabilityInstitutionsNames.slice(-1),
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

export let availabilityLineLocationsForKULeuvenRegionalViewComponent = {
  name: 'custom-availability-line-regional-view',
  enabled: true,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KUL:REGIONAL|32KUL_KUL:KULeuven_NE|32KUL_KUL:KULeuven',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: AvailabilityLineController,
    template: ''
  }
}
