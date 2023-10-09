

import "../css/index.css";

(function(){
"use strict";

var app = angular.module('viewCustom', ['angularLoad']);

    var htmlStr = '<div id="depricated-view" class="md-headline">NEW URL <a href="https://kuleuven.limo.libis.be/">https://kuleuven.limo.libis.be</a></div>';
    angular.element(document.getElementsByTagName('body')).append(htmlStr);

})();





