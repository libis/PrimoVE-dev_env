
import availabilityLineHTML from './availabilityLine.html'
// import availabilityLineCSS from './availabilityLine.css'
class AvailabilityLineController {

  constructor($scope, $translate, $element) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$element = $element;

    var s = document.createElement("style");
    s.setAttribute("id", "style_hide_availability" );
    s.innerHTML = ""
    s.innerHTML +="prm-search-result-availability-line > div, prm-search-result-availability-line > div.layout-row { display: none !important; }"
    s.innerHTML +="ul.availability-line.availability-line-jesuits-view { list-style-type: none; margin:0.2 0 0 0; padding:0; margin-block-start: 0.2em; margin-block-end: 0.1em; }"
    s.innerHTML +="ul.availability-line.availability-line-jesuits-view li { min-height: auto; }"
    s.innerHTML +="prm-search-result-availability-line:before { height: auto; }"

    document.getElementsByTagName("primo-explore")[0].appendChild(s);

  }


  $onInit() {
    let self = this;
    self.almaInstitutionsFilterInstCodeList = ["32KUL_KUL", "32KUL_KADOC"]
    self.pnxDisplaySourceList = { "RUUSBROEC_ANET": {"instCode" : "ANET Ruusbroec Collection", instName: 'Ruusbroec Collection' } }
    self.$ctrl = self.parentCtrl.parentCtrl;
    self.$scope.$ctrl = self.parentCtrl.parentCtrl;
    self.pnx = self.$ctrl.result.pnx;

    self.library_filter_array = {
      'msb jesuit armarium': {
          "url": "https://kuleuven.limo.libis.be/permalink/32KUL_KUL/tuno99/" + self.pnx.control.recordid
          //"url": "https://" + document.location.host + "/primo-explore/fulldisplay?docid="+ this.pnx.control.recordid +"&context=L&vid=KULeuven&search_scope=ALL_CONTENT&isFrbr=true&tab=all_content_tab&noLogin=true"
      },
      'kadoc jesuit armarium': {
          "url": "https://kadoc.limo.libis.be/permalink/32KUL_KADOC/dtohan/" + self.pnx.control.recordid
          //"url": "https://" + document.location.host + "/primo-explore/fulldisplay?docid="+ this.pnx.control.recordid +"&context=L&vid=KADOC&search_scope=ALL_CONTENT&isFrbr=true&tab=all_content_tab"
      },
      'anet ruusbroec collection': {
          "url": "https://anet.be/record/opacuantwerpen/" + self.pnx.display.lds12 + "/N"
      }
    }

    let translatorWatcher = this.$scope.$watch(() => {
      let translationReady = this.$translate.isReady();
      return (translationReady);
    }, (n, o) => {
        if (n == true) {
            // self.replaceAvailabiltyLine()
            translatorWatcher();
        }
    }, false);


    self.$ctrl.delivery_library = self.pnx.display.lds10.map(lds10 => {
      var library_code = lds10.toLowerCase();
      lds10 = self.library_filter_array[library_code];
      lds10['name'] = this.$translate.instant(library_code);

      return lds10;
    });

//    self.parentElement = self.$element.parent().parent()[0];

  }

  /*
  replaceAvailabiltyLine() {
    let self = this;


    self.delivery_library = self.pnx.display.lds10.map(lds10 => {
      var library_code = lds10.toLowerCase();
      lds10 = self.library_filter_array[library_code];
      lds10['name'] = this.$translate.instant(library_code);

      return lds10;
    });

    console.log ( self.delivery_library )
   

    self.$scope.$ctrl.getPlaceHolders = function () {
      return self.$scope.$ctrl.placeHolders;
    }

    if (typeof this.pnx.display.lds10 !== 'undefined' && this.pnx.display.lds10.length > 0) {
      
      self.$ctrl.showOtherLibraries = function () { false }
      self.$ctrl.showDisplayOtherLocations = function () { false }
      self.$ctrl.result.delivery.availability = ["available_in_library"];


      let availabilityInstitutionsNames = self.delivery_library.map ( library => library["name"])
      

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
  }
*/

}

AvailabilityLineController.$inject = ['$scope', '$translate', "$element"];

export let availabilityLineLocationsForKULeuvenRegionalViewwConfig = {
  name: 'custom-availability-line-jesuits-view',
  enabled: true,
  appendTo: 'prm-search-result-availability-line-after',
  enableInView: '32KUL_KUL:JESUITS|32KUL_LIBIS_NETWORK:JESUITS_UNION',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: AvailabilityLineController,
    template: availabilityLineHTML
  }
}
