/* Click in AvailabilityLine for Scope Archive records must always open directlink in a new window */

class AvailabilityLineController {
  constructor($scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    let self = this;
    self.sourceList = ["lirias"]
    self.$ctrl = self.parentCtrl.parentCtrl;
    self.$scope.$ctrl = self.parentCtrl.parentCtrl;

    // Filter sources from pnx via self.sourceList
    let sources = self.$ctrl.result.pnx.display.source.filter( source => {
      return ( self.sourceList.includes(source.toLowerCase()) )
    })

    if (sources.length !== 0) {
      self.$ctrl.doPrimoVEDirectLink = function (index) {
//        console.log ( "doPrimoVEDirectLink - index"+ index)      
        return false;
      }
    }
  }
}

AvailabilityLineController.$inject = ['$scope', '$translate'];

export let availabilityLineScopeArchiveComponent = {
  name: 'custom-availability-line-lirias',
  enabled: true,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KUL:Lirias.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: AvailabilityLineController,
    template: ''
  }
}
