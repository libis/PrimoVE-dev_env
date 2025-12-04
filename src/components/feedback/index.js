import feedbackHTML from "./feedback.html";
import feedbackDialogHTML from "./feedbackDialog.html";

class FeedbackController {
  constructor($element, $compile, $scope, FeedbackService) {
    $element
      .parent()
      .parent()
      .find("div")
      .append($compile(feedbackHTML)($scope));
    this.feedbackService = FeedbackService;
  }

  showFeedbackForm($event) {
    this.feedbackService.show($event, feedbackDialogHTML);
  }
}

FeedbackController.$inject = [
  "$element",
  "$compile",
  "$scope",
  "FeedbackService",
];

export let feedbackConfig = {
  name: "custom-feedback",
  enabled: true,
  appendTo: "prm-main-menu-after",
  // enableInView: '^(?!(32KUL_VLER:.*))',
  enableInView: "^(?!(32KUL_VLER:.*|32KUL_LIBS:PLEC))",
  config: {
    bindings: {
      parentCtrl: "<",
    },
    controller: FeedbackController,
    template: "",
  },
};
