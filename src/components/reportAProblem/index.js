import reportAProblemHTML from './reportAProblem.html'
import reportAProblemDialogHTML from './reportAProblemDialog.html'
import Session from '../../primo/session'

class ReportAProblemController {

  constructor($element, $compile, $scope, $mdDialog, $translate, $http, reportAProblemURL, MessageService) {
    this.$element = $element;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$translate = $translate;
    this.$http = $http;
    this.reportAProblemURL = reportAProblemURL;
    this.MessageService = MessageService;

  }

    $onInit() {
        let self = this;
        self.parentCtrl = this.parentCtrl.parentCtrl;

        let servicesWatcher = self.$scope.$watch(() => {
            let services = self.parentCtrl.service !== undefined;
            let servicesLoaded = self.parentCtrl.fullViewService.servicesArray !== undefined;
            let calculatePrimaViewItDone = self.parentCtrl.fullViewService.calculatePrimaViewItDone();
            let calculatePcDeliveryDone = self.parentCtrl.fullViewService.calculatePcDeliveryDone;
            let calculateSvcIdDone = self.parentCtrl.fullViewService.calculateSvcIdDone;
            let domElement = !!self.$element.parent().parent().find('h4').length
            return (services && servicesLoaded && calculatePrimaViewItDone && calculatePcDeliveryDone && calculateSvcIdDone && domElement);
        }, (n, o) => {
            if (n == true) {
                if (/^nui\.getit\./.test(self.parentCtrl.service.title)) {
                    self.showReportAProblembutton();
                }
                servicesWatcher(); //deregister watcher
            }
        }, false)
    }


  showReportAProblembutton() {
    var self = this;

    self.$element.parent().parent().find('h4').after(self.$compile(reportAProblemHTML)(self.$scope));

    let recordData = self.currentRecord;

    self.user = Session.user;
    self.view = Session.view;
    
    self.showReportAProblemForm = ($event) => {
      self.$mdDialog.show({
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: false,
        targetEvent: $event,
        template: reportAProblemDialogHTML,
        controller: function ($scope, $mdDialog) {
          $scope.report = {
            replyTo: self.user.email,
            message: '',
            subject: 'report a problem'
          }
          $scope.cancelReport = function () {
            $mdDialog.cancel();
          }
            $scope.sendReport = function (answer) {
              let data = {
              recordId: recordData.pnx.control.recordid[0],
              source: recordData.pnx.display.source[0],
              index: 0,
              page: 0,
              scope: '',
              query: '',
              searchType: '',
              sessionId: self.user.user_name,
              tab: '',
              title: recordData.pnx.display.title[0],
              type: 'resource_problem',
              subject: $scope.report.subject,
              view: self.view.code,
              inst: self.view.institution.code,
              loggedIn: self.user.isLoggedIn,
              onCampus: self.user.isOnCampus,
              user: self.user.display_name,
              fe: '',
              //ip: self.view.ip.address,
              ip: self.view.ip,
              message: $scope.report.message,
              replyTo: $scope.report.replyTo || self.user.email,
              userAgent: navigator.userAgent
                };
            console.log(data)
            if (recordData.pnx.control.originalsourceid !== undefined) {
              data["originalsourceid"] = recordData.pnx.control.originalsourceid[0]
            }

            if ($scope.report.replyTo.length > 0 && $scope.report.message.length > 0) {
              $mdDialog.hide();

              self.$http({
                method: 'POST',
                url: self.reportAProblemURL,
                headers: {
                  'Content-Type': 'application/json',
                  'X-From-ExL-API-Gateway': undefined
                },
                cache: false,
                data: data
              }).then(function (response) {
                let message = self.$translate.instant('nui.customization.report_a_problem.success') || 'Thank you for your feedback!';
                self.MessageService.show(message, { scope: $scope, hideDelay: 5000 });
              }, function (response) {
                let message = self.$translate.instant('nui.customization.report_a_problem.fail') || 'Unable to submit feedback.';
                self.MessageService.show(message, { scope: $scope, hideDelay: 5000 });
              });

            }
          }
        }
      });
    }; //showReportAProblemForm     
  }

  get currentRecord() {
  let selector = 'prm-full-view-service-container'; //'prm-full-view-service-container'
  let element = angular.element(document.querySelector(selector));
  if (element) {
    let elementCtrl = element.controller(selector);
    // console.log(elementCtrl);
    return elementCtrl.item;
  }
  return null;
}
}

ReportAProblemController.$inject = ['$element', '$compile', '$scope', '$mdDialog', '$translate', '$http', 'reportAProblemURL', 'MessageService'];

export let reportAProblemcomponent = {
  name: 'custom-report-a-problem',
  enabled: true,
//   appendTo: 'prm-service-header-after',
  appendTo: 'prm-full-view-service-container-after',
    enableInView: '^(?!(32KUL_VLER:.*))',
  config: {
    bindings: { parentCtrl: '<' },
    controller: ReportAProblemController,
    template: ''
  }
}
