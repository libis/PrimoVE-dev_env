import briefLocationsForBibliographicViewHTML from './briefLocationsForBibliographicView.html'

class BriefLocationsForBibliographicViewController {

  constructor($element, $scope, FilterLocationsService) {
    console.log ("BriefLocationsForBibliographicViewController")
    console.log (this)
    console.log (FilterLocationsService)
    this.$element = $element;
    this.$scope = $scope;
    this.vid = window.appConfig.vid;
    this.FilterLocationsService = FilterLocationsService;
  }

  $onInit() {
    let self = this;
    self.parentCtrl = this.parentCtrl.parentCtrl;
    self.item = this.parentCtrl.result;
    self.pnx = this.item.pnx;

    self.delivery_library = self.FilterLocationsService.filterLocations(self.pnx);

    // console.log (  this.delivery_library )
    self.parentElement = self.$element.parent().parent()[0];
  }

}

BriefLocationsForBibliographicViewController.$inject = ['$element', '$scope', 'FilterLocationsService'];

export let briefLocationsForBibliographicViewConfig = {
  name: 'custom-brief-locations-bibliographic-view',
  enabled: false,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KUL:JESUITS|32KUL_LIBIS_NETWORK:JESUITS_UNION',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: BriefLocationsForBibliographicViewController,
    template: briefLocationsForBibliographicViewHTML
  }
}

