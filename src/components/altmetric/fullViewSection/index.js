/**
 * The altmetrics component controller. (https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex/blob/master/js/altmetrics.component.js)
 *
 */
import altmetricSectionHTML from './altmetricSection.html'
import './altmetricSection.css'

// http intersept ""tiles""."ResultTileInterface" => hash each key ""32KUL_KUL:KULeuven.ResultTileInterfaceFrbrGeneric.ALL_CONTENT_SLOT" .tabsorder.items

class altmetricSectionController {
  constructor($element, $window, $scope) {
    var self = this;
    self.item = self.parentCtrl.parentCtrl.item;
    self.$element = $element

    self.doi = '';
    self.isbn = '';
    self.id = self.guid();
    self.recordid = '';
    self.displayService = false;

    self.sectionData = {
      scrollId: "altmetrics",
      serviceName: "altmetrics",
      title: "brief.results.tabs.Altmetrics",
      display: false,
      conditional: function (self) { return this.display; }
    };

    if (self.item && self.item.pnx && self.item.pnx.addata) {
      self.recordid = self.item.pnx.control.recordid[0];
      if (self.item.pnx.addata.doi) {
        self.doi = self.item.pnx.addata.doi[0];
      }

      if (self.item.pnx.addata.isbn) {
        self.isbn = self.item.pnx.addata.isbn[0];
      }
    }

    Object.entries(self.parentCtrl.parentCtrl.configurationUtil.briefResultConfiguration).forEach(([k, v]) => {
      var briefResultConfiguration = self.parentCtrl.parentCtrl.configurationUtil.briefResultConfiguration[k]
      var _tabsorder = briefResultConfiguration.tabsorder.items.split(',');
      if (!_tabsorder.includes(self.sectionData.scrollId)) {
        _tabsorder.push(self.sectionData.scrollId)
        self.parentCtrl.parentCtrl.configurationUtil.briefResultConfiguration[k].tabsorder.items = _tabsorder.join(',');
      }
    })
    self.parentCtrl.parentCtrl.fullViewService.addServiceDirective(self.sectionData.serviceName, self.sectionData);

    //this is a watcher on the local scope and will trigger altmetric
    let altmetricWatcher = $scope.$watch(() => {
      let altmetricLoaded = (typeof window._altmetric_embed_init) === 'function';
      let isbnExists = document.querySelector(`#altmetric-section-isbn-${self.id}`) != null;
      let doiExists = document.querySelector(`#altmetric-section-doi-${self.id}`) != null;
      let runTrigger = (altmetricLoaded && (isbnExists || doiExists));
      //console.log(self.id, altmetricLoaded, isbnExists, doiExists, runTrigger);
      return runTrigger;
    }, (n, o) => {
      if (n == true) {
        console.log("trigger section altmetric for:", self.recordid);
        $window._altmetric_embed_init(`#altmetric-section-isbn-${self.id}`);
        $window._altmetric_embed_init(`#altmetric-section-doi-${self.id}`);

        angular.element(document.querySelector(`#altmetric-section-doi-${self.id}`)).on('altmetric:show', function () {
          var sectionSelector = `div.full-view-section#${self.sectionData.scrollId} div.full-view-section-content div.section-body`;
          self.sectionData.display = true;
          self.waitForTargetThenMoveSection(sectionSelector, self.$element);
        });
        altmetricWatcher(); //deregister watcher
      }
    }, false);
  }

  // Wait for the target element to be created.
  waitForTargetThenMoveSection(sectionTargetSelector, sectionSourceElement) {
    let unbindWatcher = self.$scope.$watch(() => {
      let targetElementExists = document.querySelector(sectionTargetSelector) != null;
      return targetElementExists;
    }, (n, o) => {
      if (n == true) {
        let targetElement = document.querySelector(sectionTargetSelector)
        if (targetElement && targetElement.appendChild) {
          targetElement.appendChild(sectionSourceElement[0]);
        }
        unbindWatcher();
      }
    }
    );
  }


  guid() {
    let s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
};

altmetricSectionController.$inject = ['$element', '$window', '$scope'];


export let altmetricSectionConfig = {
  name: 'custom-altmetric-section',
  enabled: true,
  appendTo: 'prm-full-view-after',
  enableInView: '.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: altmetricSectionController,
    template: altmetricSectionHTML
  }
}
