/* Click in AvailabilityLine for Scope Archive records must always open directlink in a new window */

class AvailabilityLineController {
  constructor($scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    let self = this;
    self.sourceList = ["scopearchive"]
    self.$ctrl = self.parentCtrl.parentCtrl;
    self.$scope.$ctrl = self.parentCtrl.parentCtrl;

    // Filter sources from pnx via self.sourceList
    let sources = self.$ctrl.result.pnx.display.source.filter( source => {
      console.log (source)
      return ( self.sourceList.includes(source.toLowerCase()) )
    })

    if (sources.length !== 0) {
      self.$ctrl.doPrimoVEDirectLink = function (index) {
        console.log ( "doPrimoVEDirectLink - index"+ index)      
        return true;
      }
    }
/*    
    console.log ( self.$ctrl)
    console.log ( "displayedAvailability:"+ self.$ctrl.displayedAvailability );
    console.log ( "delivery.displayedAvailability:"+ self.$ctrl.result.delivery.displayedAvailability)
    console.log ( "delivery.availability:"+self.$ctrl.result.delivery.availability[0] );
*/

  }
}

AvailabilityLineController.$inject = ['$scope', '$translate'];

export let availabilityLineScopeArchiveComponent = {
  name: 'custom-availability-line-scopearchive',
  enabled: true,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KADOC:',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: AvailabilityLineController,
    template: ''
  }
}
