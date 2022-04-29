import LinkToBlankIllRequestHTML from './linkToBlankIllRequest.html'

class LinkToBlankIllRequestController {
  constructor($scope, $translate, $element) {
    this.showLink = false
    var upperEl = this.upperElement($element,'prm-requests');
    if (  upperEl    ){
      this.showLink = true
    }   
    $scope.goToBlankIllRequest = function ($event) {
      window.location.href="/discovery/blankIll?vid=" + window.appConfig.vid;
      
    }
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

LinkToBlankIllRequestController.$inject = ['$scope', '$translate', '$element']

export let LinkToBlankIllRequestcomponent = {
  name: 'custom-link-to-blank-ill-request',
  enabled: true,
  appendTo: 'prm-account-links-after',
  enableInView: '32KUL_KUL:KULeuven',
    config: {
        bindings: { parentCtrl: '<' },
        controller: LinkToBlankIllRequestController,
        template: LinkToBlankIllRequestHTML
    }
}

