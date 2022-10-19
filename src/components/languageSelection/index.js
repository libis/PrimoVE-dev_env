
class LanguageSelectionController {
  constructor() {
    var onlyshow_fr_FR_in_vid = ['32KUL_ACV:ACV', '32KUL_BPB:BPB', '32KUL_VCV:FARO', '32KUL_FIN:FODFIN', '32KUL_KBC:KBC', '32KUL_RBINS:RBINS', '32KUL_RMCA:RMCA', '32KUL_KMMR:KMKG', '32KUL_NBB:NBB','32KUL_NBB:NBBMED', '32KUL_TIFA:BOSA', '32KUL_VES:VDIC'];

    if (!onlyshow_fr_FR_in_vid.includes(window.appConfig.vid)) {
      var s = document.createElement("style");
      s.setAttribute("id", "style_languageRemove_fr_FR" );
      s.innerHTML = ""
      s.innerHTML += "prm-language-selection md-list-item[value='fr']{display:none !important;}";
      s.innerHTML += "md-option[value='fr_FR'] {display: none !important;}";

      document.getElementsByTagName("primo-explore")[0].appendChild(s);
    }

    var hide_en_US_in_vid  = ["32KUL_VLP:VLP","32KUL_DOCVB:docvlaamsbrabant"];

    if (hide_en_US_in_vid.includes(window.appConfig.vid)) {
      var s = document.createElement("style");
      s.setAttribute("id", "style_languageRemove_en_US" );
      s.innerHTML = ""
      s.innerHTML += "prm-language-selection md-list-item[value='en']{display:none !important;}";
      s.innerHTML += "md-option[value='en_US'] {display: none !important;}";

      document.getElementsByTagName("primo-explore")[0].appendChild(s);
    }

    var hide_langauge_selection_in_vid  = ["32KUL_VLP:VLP","32KUL_DOCVB:docvlaamsbrabant"];
    if (hide_langauge_selection_in_vid.includes(window.appConfig.vid)) {
      var s = document.createElement("style");
      s.setAttribute("id", "style_languageSelection" );
      s.innerHTML = ""
      s.innerHTML += "md-menu-item.my-languages-ctm {display: none !important;}";
      
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
