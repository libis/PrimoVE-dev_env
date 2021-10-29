import altmetricHTML from './altmetric.html'

/*
//script needs to be loaded first. Can be put in the $onInit() function
//or better in run method.
app.run(($templateCache) => {
  Helper.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(function () {
    console.log('altmerics.js loaded');
  });
});
*/


class AltMetricController {
  constructor($element, $window, $scope) {
    var self = this;
    let item = self.parentCtrl.parentCtrl.item;

    self.doi = '';
    self.isbn = '';
    self.id = self.guid();
    self.recordid = '';


    if (item && item.pnx && item.pnx.addata) {
      self.recordid = item.pnx.control.recordid[0];
      if (item.pnx.addata.doi) {
        self.doi = item.pnx.addata.doi[0];
      }

      if (item.pnx.addata.isbn) {
        self.isbn = item.pnx.addata.isbn[0];
      }
    }

    //this is a watcher on the local scope and will trigger altmetric
    let altmetricWatcher = $scope.$watch(() => {
      let altmetricLoaded = (typeof window._altmetric_embed_init) === 'function';
      let isbnExists = document.querySelector(`#altmetric-isbn-${self.id}`) != null;
      let doiExists = document.querySelector(`#altmetric-doi-${self.id}`) != null;
      let runTrigger = ( altmetricLoaded && (isbnExists || doiExists) );

      //console.log(self.id, altmetricLoaded, isbnExists, doiExists, runTrigger);
      return runTrigger;
    }, (n, o) => {
      if (n == true) {
        console.log("trigger altmetric for:", self.recordid);
        $window._altmetric_embed_init(`#altmetric-isbn-${self.id}`);
        $window._altmetric_embed_init(`#altmetric-doi-${self.id}`);
        altmetricWatcher(); //deregister watcher
      }
    }, false);
  }

  guid() {
    let s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

AltMetricController.$inject = ['$element', '$window', '$scope'];

export let altMetricComponent = {
  name: 'custom-altmetric',  
  enabled: false,
  appendTo: 'prm-brief-result-after',
  enableInView: '.*',
  config: {  
    bindings: {
      parentCtrl: '<'
    },
    controller: AltMetricController,
    template: altmetricHTML
  }
}
