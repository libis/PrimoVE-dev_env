import topbarHTML from './templates/topbar.html'
import topbarMainMenuHTML from './templates/topbar-main-menu.html'
import changeLangHTML from './templates/changeLang.html'

(function () {
    "use strict";

    var app = angular.module('viewCustom', ['angularLoad']);

    app.run(($templateCache) => {
        $templateCache.put('components/search/topbar/topbar.html', topbarHTML);
        $templateCache.put('components/search/topbar/mainMenu/main-menu.html', topbarMainMenuHTML);
        $templateCache.put('components/infra/lang/change-lang.html', changeLangHTML);
    });

})();


//import "../css/_index.css";
