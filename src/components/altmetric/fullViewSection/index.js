/**
 * The altmetrics component controller. (https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex/blob/master/js/altmetrics.component.js)
 *
 */
import altmetricSectionHTML from './altmetricSection.html'
import './altmetricSection.css'

class altmetricSectionController {
  constructor($element, $window, $scope) {
    this.$element = $element;
    this.$window = $window;
    this.$scope = $scope;
  }

  $onInit() {
    let self = this;
    let $scope = self.$scope;
    let $window = self.$window;
    let $element = self.$element;
    self.item = self.parentCtrl.parentCtrl.item;

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
        altmetricWatcher(); //deregister watcher
        $window._altmetric_embed_init(`#altmetric-section-isbn-${self.id}`);
        $window._altmetric_embed_init(`#altmetric-section-doi-${self.id}`);


     ///    this.fullViewService.updateServices ?????
     ///    this.fullViewService.isPromiseResolved  ????

        angular.element(document.querySelector(`#altmetric-section-doi-${self.id}`)).on('altmetric:show', function () {
          self.sectionData.display = true;
        });

        angular.element(document.querySelector(`#altmetric-section-isbn-${self.id}`)).on('altmetric:show', function () {
          self.sectionData.display = true;
        });

      }
    }, false);
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
    enableInView: '32KUL_KUL.*|32KUL_HUB.*|32KUL_KHK.*|32KUL_KHL.*|32KUL_KHM.*|32KUL_KATHO.*|32KUL_VLER.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: altmetricSectionController,
    template: altmetricSectionHTML
  }
}

class altmetricSectionRefreshController {
  constructor($element, $scope, $timeout) {
    var self = this;
    self.$element = $element;
    self.$scope = $scope;
    self.$timeout = $timeout;
    self.service_scrollId = 'altmetrics';

    self.moveToAltmetricSection(self);
    /*
    self.$timeout(() => {
      self.moveToAltmetricSection(self);
    }, 400);
    */
  };

  moveToAltmetricSection(self) {
    //this is a watcher on the local scope and will trigger altmetric
    let altmetricWatcher = self.$scope.$watch(() => {
      let altmetricLoaded = (typeof window._altmetric_embed_init) === 'function';
      let serviceLoaded = ( self.parentCtrl.parentCtrl.service !== undefined );
      let runTrigger = (altmetricLoaded && serviceLoaded);
      return runTrigger;
    }, (n, o) => {
      if (n == true) {
        self.$timeout(() => {
          if ( self.parentCtrl.parentCtrl.service.scrollId === self.service_scrollId ) {
            // var sectionSelector = `div.full-view-section#${self.service_scrollId} div.full-view-section-content div.section-body`;
            let altmetricBadge = document.querySelector('custom-altmetric-section div.altmetric-section-badge').cloneNode(true);
            let targetElement = self.$element.parent().parent().find('div')[2];
            if ( !targetElement.querySelector('div.altmetric-section-badge') ){
              targetElement.appendChild( altmetricBadge )
            }
          }
        }, 1000);
        altmetricWatcher(); //deregister watcher
      }
    }, false);
  }
}

altmetricSectionRefreshController.$inject = ['$element', '$scope', '$timeout'];

export let altmetricSectionRefreshConfig = {
  name: 'custom-altmetric-section-refresh',
  enabled: true,
  appendTo: 'prm-full-view-service-container-after',
    enableInView: '32KUL_KUL.*|32KUL_HUB.*|32KUL_KHK.*|32KUL_KHL.*|32KUL_KHM.*|32KUL_KATHO.*|32KUL_VLER.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: altmetricSectionRefreshController,
    template: ''
  }
}





