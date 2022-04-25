/*
  General entry to Primo custom methods
  (c)2020 KULeuven/LIBIS 
  Mehmet Celik  
*/

"use strict"
import Primo from './primo';
import Loader from './loader';

import './modules/pubSubInterceptor';
import './modules/google';
import './modules/altmetric';
import './modules/browzine';
import './modules/generalMessage';
import './modules/feedback';

/* TODO : extra css from institute ? */
import "./css/index.css";
/**/

(function () {
  let customType = 'centralCustom';
  window.Primo = new Primo();
    
  let moduleList = ['pubSubInterceptor', 'ngMaterial', 'vcRecaptcha', 'angularLoad', 'google', 'altmetric', 'browzine',  'reCaptcha', 'generalMessage', 'feedback'];
  let servicesHost = 'https://services.libis.be/';


  let app = angular.module(customType, moduleList).config(($sceDelegateProvider) => {
      $sceDelegateProvider.resourceUrlWhitelist([
        '**'
      ]);
    })
    .constant('reportAProblemURL', servicesHost + 'report_a_problem')
    .constant('feedbackServiceURL', servicesHost + 'feedback')
    .constant('requestACopyURL', servicesHost + 'request_a_copy')    
    .run(($templateCache) => {
      $templateCache.put ('components/search/fullView/full-view.html', $templateCache.get('components/search/fullView/full-view.html').replace('"service in $ctrl.services.slice(1) track by $index"', '"service in $ctrl.services.slice(1) track by service.scrollId"'));
    });

  //Load components
  new Loader().load(customType);
  console.log(`Done initializing ${customType}`)
})();