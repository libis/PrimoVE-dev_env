import "../css/index.css";
import { payFinesMessageComponent } from "../../../src/components/payFinesMessage/index";

(function () {
  "use strict";

  var app = angular.module("viewCustom", ["angularLoad"]);

  app.component(payFinesMessageComponent.name, payFinesMessageComponent.config);
})();
