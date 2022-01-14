
class LanguageSelectionController {
  constructor() {
    var onlyshow_fr_FR_in_vid = ['ACV', 'BPB', 'FARO', 'FODFIN', 'KBC', 'RBINS', 'RMCA', 'KMKG', 'LIBAR', 'NBB', 'OFO', 'VDIC'];

    if (!onlyshow_fr_FR_in_vid.includes(window.appConfig.vid)) {
      var s = document.createElement("style");
      s.setAttribute("id", "style_languageSelection" );
      s.innerHTML = ""
      s.innerHTML += "prm-language-selection md-list-item[value='fr']{display:none !important;}";
      s.innerHTML += "md-option[value='fr_FR'] {display: none !important;}";

      document.getElementsByTagName("primo-explore")[0].appendChild(s);
    }

  }
}

LanguageSelectionController.$inject = []

export let LanguageSelectionConfig = {
  name: 'custom-language-selection',
  enabled: true,
  appendTo: 'prm-explore-footer-after',
  enableInView: '.*',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: LanguageSelectionController,
    template: ''
  }
}
