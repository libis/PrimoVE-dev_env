import topbarHTML from './templates/topbar.html'
import topbarMainMenuHTML from './templates/topbar-main-menu.html'
import changeLangHTML from './templates/changeLang.html'
import resourceTypeHTML from './templates/brief-result-replace-resource-type.html'
import fullViewDetailsServiceDetailsHTMl from './templates/full-view-details-service-details.html'

(function () {
    "use strict";

    var app = angular.module('viewCustom', ['angularLoad']);

    app.run(($templateCache) => {
        $templateCache.put('components/search/topbar/topbar.html', topbarHTML);
        $templateCache.put('components/search/topbar/mainMenu/main-menu.html', topbarMainMenuHTML);
        $templateCache.put('components/infra/lang/change-lang.html', changeLangHTML);
        // $templateCache.put('components/search/briefResult/briefResultContainer.html', resourceTypeHTML);
        $templateCache.put('components/search/fullView/details/service-details.html',fullViewDetailsServiceDetailsHTMl);
    });

})();


import "../css/_index.css";
