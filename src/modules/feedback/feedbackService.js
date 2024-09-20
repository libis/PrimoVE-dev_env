import feedbackServiceHTML from './feedbackService.html'
import DialogController from './dialog'


export default class FeedbackService {
  constructor($mdDialog) {
    this.mdDialog = $mdDialog;
  }

  show($event = null, feedbackDialogHTML = null, feedbackDialogController = null) {
    let self = this;
    if (feedbackDialogHTML == null) {
      console.log('default dialog instantiated');
      feedbackDialogHTML = feedbackServiceHTML;
    }

    if (feedbackDialogController == null) {
      console.log('default dialog controller instantiated');
      feedbackDialogController = DialogController;
    }

    this.mdDialog.show({
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: false,
      targetEvent: $event,
      template: feedbackDialogHTML,
      controller: feedbackDialogController,
      locals: {target: $event.target}
    });
  }
}

FeedbackService.$inject = ['$mdDialog'];

angular.module('feedback', ['ng']).service('FeedbackService', FeedbackService);