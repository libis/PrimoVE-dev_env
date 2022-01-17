import LinkToMyLibraryCardHTML from './linkToMyLibraryCard.html'

class LinkToMyLibraryCardController {
  constructor($scope, $translate, $state) {
    let self = this;
    self.$translate = $translate
    self.$state = $state
    self.lang = self.$translate.use();

    console.log("TSET")
    console.log(this)
    console.log($scope)
    console.log($state)

    $scope.aria_label = self.$translate.instant( "nui.customization.linkToMyLibraryCard.aria_label" )
    
/*
    $scope.aria_label = "Link to my Library Account";
    nui.customization.linkToMyLibraryCard.title
    $scope.title = "My Library Account";
    nui.customization.linkToMyLibraryCard.aria_label

*/

    $scope.goToMyLibraryCard = function ($event) {
      self.$state.go('account', { vid: window.appConfig.vid, lang: self.lang, section: 'overview' }, { reload: true });
    }

  }
}

LinkToMyLibraryCardController.$inject = ['$scope', '$translate', '$state']

export let linkToMyLibraryCardConfig = {
  name: 'prm-link-to-my-library-card',
  enabled: true,
  appendTo: null,
  enableInView: '.*',
  config: {
    bindings: { parentCtrl: '<' },
    controller: LinkToMyLibraryCardController,
    template: LinkToMyLibraryCardHTML
  }
}

