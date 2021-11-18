
///////////////////////////////////////////////////////////////////////////
// Puts an icon in the brief result
// The icons are placed in the img-folder of the central-package
//
////////////////////////////////////////////////////////////////////////////

import sourceIconHTML from './sourceIcon.html'

class SourceIconController {
  constructor($scope, $element, $compile) {
    var self = this;
    var parentCtrl = $scope.$parent.$ctrl.parentCtrl;
    var iconConf = [{
      'sourceid': 'lirias',
      'iconUrl': 'custom/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img/lirias.jpg',
      'iconText': 'Lirias'
    }];

    var iconConfSources = iconConf.map(obj => obj.sourceid);

    self.sourceid = null;
    if ('sourceid' in parentCtrl.item.pnx.control) {
      self.sourceid = parentCtrl.item.pnx.control.sourceid[0].toLowerCase();

      if (iconConfSources.includes(self.sourceid)) {
        self.icon = iconConf.find(function(x) {
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
  enableInView: '.*'
}