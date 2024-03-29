
///////////////////////////////////////////////////////////////////////////
// Puts an icon in the brief result
// The icons are placed in the img-folder of the central-package
//
////////////////////////////////////////////////////////////////////////////

import sourceIconHTML from './sourceIcon.html'

class SourceIconController {
  constructor($scope, $element, $compile) {
    this.$scope = $scope;
    this.$element = $element;
    this.$compile = $compile;
  }

  $onInit() {
    let self = this;
    let $scope = self.$scope;
    let $element = self.$element;
    let $compile = self.$compile;

    let parentCtrl = $scope.$parent.$ctrl.parentCtrl;
    let iconConf = [{
      'sourceid': 'lirias',
      'iconUrl': 'custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/lirias.jpg',
      'iconText': 'Lirias'
    },
    {
      'sourceid': 'lirias_basic',
      'iconUrl': 'custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/lirias.jpg',
      'iconText': 'Lirias'
    }];

    let iconConfSources = iconConf.map(obj => obj.sourceid);

    self.sourceid = null;

    if ('source' in parentCtrl.item.pnx.display) {
      //self.sourceid = parentCtrl.item.pnx.control.sourceid.toLowerCase();
      self.sourceid = parentCtrl.item.pnx.display.source[0].toLowerCase();

      if (iconConfSources.includes(self.sourceid)) {
        self.icon = iconConf.find(function (x) {
          return x.sourceid === self.sourceid;
        });
      }
    }
    $element.parent().parent().parent().find('div').append($compile(sourceIconHTML)($scope));
  }
}

SourceIconController.$inject = ['$scope', '$element', '$compile'];


export let sourceIconComponent = {
  name: 'custom-source-icon',
  config: {
    bindings: { parentCtrl: '<' },
    controller: SourceIconController,
    template: ''
  },
  enabled: true,
  appendTo: 'prm-brief-result-after',
  enableInView: '^(?!32KUL_KUL:Lirias)'
}