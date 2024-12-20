import LinkToBlankIllRequestHTML from './linkToBlankIllRequest.html'

class LinkToBlankIllRequestController {
  constructor($scope, $translate, $element,FeedbackService) {
    this.showLink = false
    this.showLink2 = false
    this.feedbackService = FeedbackService;
    var upperRequests = this.upperElement($element,'prm-requests');
    var upperLoans = this.upperElement($element,'prm-loans');
    if (  upperRequests    ){
      this.showLink = true
    }  
    if (  upperLoans    ){
      this.showLink2 = true
    } 
    $scope.goToBlankIllRequest = function ($event) {
      window.location.href="/discovery/blankIll?vid=" + window.appConfig.vid;
      
    }
  }

  showFeedbackForm($event) {  
    this.feedbackService.show($event);
  }

  upperElement = function(start_el,el){
    console.log (start_el.parent()[0].nodeName  )
    if ( start_el.parent()[0].nodeName  === "#document"){
      return false;
    }
    if ( start_el.parent()[0].nodeName.toUpperCase()  === el.toUpperCase()){
      return start_el.parent();
    }
    return this.upperElement(start_el.parent(), el)
  }
}

LinkToBlankIllRequestController.$inject = ['$scope', '$translate', '$element','FeedbackService']

export let LinkToBlankIllRequestcomponent = {
  name: 'custom-link-to-blank-ill-request',
  enabled: true,
  appendTo: 'prm-account-links-after',
  enableInView: '32KUL_KUL:KULeuven.*|32KUL_KUL:REGIONAL.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: LinkToBlankIllRequestController,
        template: LinkToBlankIllRequestHTML
    }
}