import "../css/index.css";

// (function(){
// "use strict";

// var app = angular.module('viewCustom', ['angularLoad']);

(function () {
  "use strict";

  var app = angular.module("viewCustom", ["angularLoad"]);

  // -------------------------------------------------------------------
  // Diagnostics
  // -------------------------------------------------------------------
  console.log("semmi test log");

  // -------------------------------------------------------------------
  // Lean Library: One‑Click‑to‑PDF bootstrap (script loader + config)
  // -------------------------------------------------------------------
  window.llLinkingWidget = {
    institutionId: "Xutpfow",
    apiKey: "aeea9737-855f-411b-b876-338c2373aff1",
  };

  window.llLinkingWidget.script = document.createElement("script");
  window.llLinkingWidget.script.src =
    "https://cdn.leanlibrary.app/linking-widget/primo.js";
  document.head.appendChild(window.llLinkingWidget.script);

  // Helper: initialize Lean Library safely (waits if script not ready)
  function initLeanLibraryOnScope($scope) {
    function tryInit(attempt) {
      try {
        if (
          window.llLinkingWidget &&
          typeof window.llLinkingWidget.primo === "function"
        ) {
          window.llLinkingWidget.primo($scope).catch(console.error);
          return;
        }
      } catch (e) {
        console.error("Lean Library init error:", e);
        return;
      }
      if (attempt < 10) {
        setTimeout(function () {
          tryInit(attempt + 1);
        }, 200);
      } else {
        console.warn(
          "Lean Library primo() not available after retries — skipping.",
        );
      }
    }

    // If/when the external script loads, try again
    if (
      window.llLinkingWidget &&
      window.llLinkingWidget.script &&
      window.llLinkingWidget.script.addEventListener
    ) {
      window.llLinkingWidget.script.addEventListener(
        "load",
        function () {
          tryInit(0);
        },
        { once: true },
      );
    }

    // First attempt immediately
    tryInit(0);
  }

  // -------------------------------------------------------------------
  // CONFLICT-SAFE INTEGRATION:
  // Decorate the existing Primo component directive so we DO NOT
  // register a second directive with an isolated scope on the same element.
  // This avoids: "$compile:multidir Multiple directives ... isolated scope"
  //
  // This implements Lean Library's guidance for coexisting with other
  // discovery link integrations by initializing both from a single place.
  // (We call Lean Library here; add any other link-widget init if needed.)
  // -------------------------------------------------------------------
  app.config([
    "$provide",
    function ($provide) {
      $provide.decorator("prmSearchResultAvailabilityLineAfterDirective", [
        "$delegate",
        function ($delegate) {
          var d = $delegate[0];

          // Preserve any existing controller
          var originalController = d.controller;

          d.controller = [
            "$scope",
            function ($scope) {
              // 1) Initialize Lean Library for this result scope
              initLeanLibraryOnScope($scope);

              // 2) If you have another link integration that expects to be
              //    called here, do it now. Example placeholder:
              // if (window.thirdpartyWidget &&
              //     typeof window.thirdpartyWidget.someInitialisationFunction === "function") {
              //   window.thirdpartyWidget.someInitialisationFunction($scope);
              // }

              // 3) Call original controller (if it exists), preserving 'this'
              if (typeof originalController === "function") {
                try {
                  return originalController.apply(this, arguments);
                } catch (e) {
                  console.error(
                    "Error calling original AvailabilityLineAfter controller:",
                    e,
                  );
                }
              }
            },
          ];

          return $delegate;
        },
      ]);
    },
  ]);

  // NOTE:
  // We intentionally DO NOT register:
  //   app.controller('prmSearchResultAvailabilityLineAfterController', ...)
  //   app.component('prmSearchResultAvailabilityLineAfter', ...)
  // Doing so would double-bind the same component and reproduce the
  // "$compile:multidir" error you observed.
  //
  // Lean Library’s support notes that when other discovery link integrations
  // are present, a small adjustment is required so both services initialize
  // without conflict. This decorator achieves that safely. [1](https://support.leanlibrary.com/hc/en-gb/articles/5034699958687-Additional-code-for-libraries-using-other-discovery-link-integrations-in-Primo)[2](https://support.leanlibrary.com/hc/en-gb/articles/5034668436255-One-Click-to-PDF-How-to-add-the-code-snippet-to-your-Library-Discovery)
})();
