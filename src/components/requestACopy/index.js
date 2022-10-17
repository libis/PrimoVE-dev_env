import requestACopyHTML from './requestACopy.html'
import requestACopyDialogHTML from './requestACopyDialog.html'

class RequestACopyController {
  constructor($element, $compile, $scope, $mdDialog, $translate, $http, requestACopyURL, MessageService) {
    this.$element = $element;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$translate = $translate;
    this.$http = $http;
    this.requestACopyURL = requestACopyURL;
    this.MessageService = MessageService;
  }

  $onInit() {
    let self = this;
    /*
    let $element = self.$element;
    let $compile = self.$compile;
    let $scope = self.$scope;
    let $mdDialog = self.$mdDialog;
    let $translate = self.$translate;
    let $http = self.$http;
    let requestACopyURL = self.$requestACopyURL;
    let MessageService = self.$MessageService;
    */
    self.parentCtrl = this.parentCtrl.parentCtrl;
    self.recordData = self.parentCtrl.item;
    self.recordPnx = self.recordData.pnx;

    /* captcha implementation (Already used in ) https://github.com/VividCortex/angular-recaptcha */

    let TypesShowRequestACopy = ['chapter','journal-article','thesis-dissertation','conference','report','dataset','c-bookreview','media','software'];
    let StatusShowRequestACopy = ['published'];
    
    var ShowRequestACopyType = self.recordPnx.display.lds07.filter(value => -1 !== TypesShowRequestACopy.indexOf( value.toLowerCase() ));
    var ShowRequestACopyStatus = self.recordPnx.display.lds08.filter( value =>  
        StatusShowRequestACopy.filter( status => 
          new RegExp(status).test( value.toLowerCase() ) 
        ).length > 0  
      );

 
    if (self.parentCtrl.service) {      

      if ( ShowRequestACopyType.length == 0 ) {
        console.log ("No RequestACopy if it is not  " + TypesShowRequestACopy )
      }

      /*
      console.log (self.parentCtrl.service)
      console.log (self.parentCtrl.service.scrollId)
      console.log (ShowRequestACopyType)
      console.log (ShowRequestACopyStatus)
      console.log( !self.recordPnx.display.oa )
      */

      if (  /^getit_link.*/.test(self.parentCtrl.service.scrollId) && !self.recordPnx.display.oa && ShowRequestACopyType.length > 0 && ShowRequestACopyStatus.length > 0 ) {
        let servicesWatcher = self.$scope.$watch(() => {
          let servicesLoaded = self.parentCtrl.fullViewService.servicesArray !== undefined;
          let calculatePrimaViewItDone = self.parentCtrl.fullViewService.calculatePrimaViewItDone();
          let calculatePcDeliveryDone =self.parentCtrl.fullViewService.calculatePcDeliveryDone;
          let calculateSvcIdDone = self.parentCtrl.fullViewService.calculateSvcIdDone;
          return (servicesLoaded && calculatePrimaViewItDone && calculatePcDeliveryDone && calculateSvcIdDone);
        }, (n, o) => {
          if (n == true) {
              self.showRequestACopyButton();
              servicesWatcher(); //deregister watcher
          }
        }, false)
      }
    }
  }
  
  showRequestACopyButton() {
    var self = this;
    Primo.user.then(user => {
      self.user = user;
      Primo.view.then(view => {
        self.view = view;
        self.onCampus = self.user.isOnCampus();         
  
        
//     console.log (self.parentCtrl.service.scrollId)

        if ( /^getit_link1_0.*/.test(self.parentCtrl.service.scrollId) ) {
          var appendButtonTo = self.$element
/*
          console.log ("self.recordPnx")
          console.log (self.recordPnx)
          console.log ("self.recordData")
          console.log (self.recordData)
          console.log ("self.parentCtrl.service")
          console.log (self.parentCtrl.service)
          console.log (self.$element)
          console.log(  self.recordData.delivery.availability )
          console.log ( self.$scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.availability)
          console.log(  self.recordData.delivery.availability.filter(availability => ['no_inventory', 'fulltext_unknown'].includes(availability)).length ) 
          console.log ("onCampus :" + self.onCampus)
*/          

          // console.log( "self.recordData.delivery.availability: " + self.recordData.delivery.availability.toString() )
          
          // self.onCampus = false 

          // console.log ("onCampus :" + self.onCampus)
          // console.log (self.recordData.delivery.electronicServices)

          if (  self.recordData.delivery.availability.filter(availability => ['no_inventory'].includes(availability)).length > 0 ) {
            console.log( " ===> Add appendButtonTo requestACopyHTML [no_inventory] ")
            self.showRequestACopy = true;
            appendButtonTo.after(self.$compile(requestACopyHTML)(self.$scope))
          }
          if (  (  self.recordData.delivery.availability.filter(availability => ['fulltext_unknown'].includes(availability)).length > 0 ) ) {
            console.log( " ===> Add appendButtonTo requestACopyHTML [fulltext_unknown] ")
            
            self.showRequestACopy = true;
            appendButtonTo.after(self.$compile(requestACopyHTML)(self.$scope))
          }
          if ( !self.onCampus && (  self.recordData.delivery.availability.filter(availability => ['fulltext_unknown'].includes(availability)).length > 0 ) ) {
            console.log( " ===> Add appendButtonTo requestACopyHTML [fulltext_unknown] [off_campus]")
            self.showRequestACopy = true;
            appendButtonTo.after(self.$compile(requestACopyHTML)(self.$scope))
          }
          if ( !self.onCampus && (  self.recordData.delivery.availability.filter(availability => ['not_restricted'].includes(availability)).length > 0 ) ) {
            console.log( " ===> Add appendButtonTo requestACopyHTML [not_restricted] [off_campus]")
            self.showRequestACopy = false;
            appendButtonTo.after(self.$compile(requestACopyHTML)(self.$scope))
          }

          /* Not One file service that does not contains [ Available for KU Leuven users] And off-cmapus */
          if ( 
            !self.onCampus && 
            (  self.recordData.delivery.availability.filter(availability => ['fulltext_linktorsrc'].includes(availability)).length > 0 ) &&
            self.recordData.delivery.electronicServices.filter(s => { ! /.*\[Available for KU Leuven users\]$/.test(s.packageName);} ).length == 0
          ) {
            console.log( " ===> Add appendButtonTo requestACopyHTML [fulltext_linktorsrc] [off_campus]  packageName contains Available for KU Leuven users )")
            self.showRequestACopy = true;
            appendButtonTo.after(self.$compile(requestACopyHTML)(self.$scope))
          }
        }
      });
    });
  }
  
  showRequestACopyForm($event) {
    var self = this;
    self.$mdDialog.show({
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: false,
      targetEvent: $event,
      template: requestACopyDialogHTML,
      controller: function ($scope, $mdDialog) {

        let pnxDisplay =  self.recordPnx.display;
        $scope.gCaptchaResponse = '';
        $scope.capchaPublicKey = window.recaptcha.publicCaptchaKey;
        $scope.request = {
          replyTo: self.user.email,
          motivation: '',
          title: pnxDisplay.title[0],
          contributor: (() => { ( pnxDisplay.contributor ? pnxDisplay.contributor[0].split("$$")[0] : '' ) })(),
          creator: pnxDisplay.creator ? pnxDisplay.creator[0].split("$$")[0] : '',
          ispartof: pnxDisplay.ispartof ? pnxDisplay.ispartof[0] : '',
          subject: 'request a copy'
        }

        $scope.setWidgetId = function (widgetId) {
          console.info('Created widget ID: %s', widgetId);
          $scope.widgetId = widgetId;
        };
        $scope.setResponse = function (response) {
          console.log("Get response from capture:" + response);
          $scope.gCaptchaResponse = response;
        };
        $scope.cbExpiration = function () {
          console.info('Expiration Disable Submit');
          $scope.gCaptchaResponse = '';
        };

        $scope.cancelRequest = function () {
          $mdDialog.cancel();
        }

        $scope.sendRequest = function (answer) {

          let data = {
            'g-recaptcha-response': $scope.gCaptchaResponse,
            sessionId: self.user.id,
            sourceId:  self.recordPnx.control.sourceid[0],
            recordId:  self.recordPnx.control.recordid[0],
            sourceRecordId:  self.recordPnx.control.sourcerecordid[0],
            
            title: pnxDisplay.title[0],
            contributor: (() => { ( pnxDisplay.contributor ? pnxDisplay.contributor[0] : '' ) })(),
            creator: pnxDisplay.creator ? pnxDisplay.creator[0] : '',
            ispartof: pnxDisplay.ispartof ? pnxDisplay.ispartof[0] : '',

            replyTo: $scope.request.replyTo || self.user.email,
            motivation: $scope.request.motivation
          };

        //  console.log ( data )


          if ($scope.request.replyTo.length > 0 && $scope.request.motivation.length > 0) {
            $mdDialog.hide();

            self.$http({
              method: 'POST',
              url: self.requestACopyURL,
              headers: {
                'Content-Type': 'application/json',
                'X-From-ExL-API-Gateway': undefined
              },
              cache: false,
              data: data
            }).then(function (response) {
              let message = self.$rootScope.$$childHead.$ctrl.$translate.instant('nui.customization.request_a_copy.success') || 'Thank you the request had been send!';
              self.MessageService.show(message, {scope:$scope, hideDelay: 5000});
            }, function (response) {
              let message = self.$rootScope.$$childHead.$ctrl.$translate.instant('nui.customization.request_a_copy.fail') || 'Unable to submit the request.';
              self.MessageService.show(message, {scope:$scope, hideDelay: 5000});
            });
          }
        }
      }
    });
  }
}

RequestACopyController.$inject = ['$element', '$compile', '$scope', '$mdDialog', '$translate', '$http', 'requestACopyURL', 'MessageService'];

export let requestACopyConfig = {
  name: 'custom-request-a-copy',
  enabled: true,
  appendTo: 'prm-full-view-service-container-after',
  enableInView: '^32KUL_KUL:Lirias',
  config: {
      bindings: { parentCtrl: '<' },
      controller: RequestACopyController,
      template: ''
  }
}
