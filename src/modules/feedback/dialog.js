import Session from '../../primo/session'
export default class DialogController {
  constructor($scope, $mdDialog, $mdToast, $http, $translate, feedbackServiceURL, MessageService,target) {
    this.scope = $scope;
    this.mdDialog = $mdDialog;
    this.mdToast = $mdToast;
    this.http = $http;
    this.feedbackServiceURL = feedbackServiceURL;
    this.translate = $translate;

    let self = this;
    let user = Session.user

    $scope.feedback = {
      replyTo: user.email,
      message: '',
      subject: 'feedback',
      type: 'feedback'
    }

    if(target.className == "request-feedback"){
      $scope.feedback.subject = "Requests & loans"
      $scope.feedback.type = "Requests & loans"
    }

    $scope.cancelFeedback = () => {
      this.mdDialog.cancel();
    }

    $scope.sendFeedback = this.sendFeedback;
    $scope.sendFeedback = (answer) => {
        let self = this;
        let user = Session.user;
        let view = Session.view;   
        
        let data = {
        subject: $scope.feedback.subject,
        view: view.code,
        inst: view.institution.code || window.appConfig['primo-view']['institution']['institution-code'],
        loggedIn: user.isLoggedIn,
        onCampus: user.isOnCampus,
        user: user.name,
        ip: view.ip.address,
        type: $scope.feedback.type,
        feedback: $scope.feedback.message,
        email: $scope.feedback.replyTo || user.email,
        userAgent: navigator.userAgent
        };
        
        if ($scope.feedback.replyTo.length > 0 && $scope.feedback.message.length > 0) {
            self.mdDialog.hide();        

        self.http({
            method: 'POST',
            url: this.feedbackServiceURL,
            headers: {
            'Content-Type': 'application/json',
            'X-From-ExL-API-Gateway': undefined
            },
            cache: false,
            data: data
        }).then(function (response) {
            //self.mdToast.showSimple('Thank you for your feedback!');
            let message = self.translate.instant('nui.customization.feedback.success') || 'Thank you for your feedback!';
            MessageService.show(message, {scope:$scope, hideDelay: 5000});
        }, function(response) {
            //self.mdToast.showSimple('Unable to submit feedback.');
            let message = self.translate.instant('nui.customization.feedback.fail') || 'Unable to submit feedback.';
            MessageService.show(message, {scope:$scope, hideDelay: 5000});
        });
        }     
    }
    
    
  }

}

DialogController.$inject = ['$scope', '$mdDialog', '$mdToast', '$http', '$translate', 'feedbackServiceURL', 'MessageService','target'];
