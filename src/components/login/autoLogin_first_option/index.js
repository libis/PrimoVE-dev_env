class AutoLoginFirstOptionController {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    var self = this;
    self.parentCtrl = this.parentCtrl.parentCtrl;

    console.log("autoLoginFirstOptionController initialized");

    const vid = window.appConfig.vid;
    console.log(" current vid", vid);

    const allowedVids = ["32KUL_LIBS:LIBS", "32KUL_LIBS:RVAONEM"];

    const profileMap = {
      "32KUL_LIBS:LIBS": "Alma",
      "32KUL_LIBS:RVAONEM": "RVA_AZURE",
    };
    const targetProfile = profileMap[vid];
    console.log(" target profile is: " + targetProfile);

    if (allowedVids.includes(vid) && self.parentCtrl.authenticationMethods) {
      const filteredMethods = self.parentCtrl.authenticationMethods.filter(
        (method) => {
          console.log("checking method.profileName: " + method.profileName);
          return method.profileName === targetProfile;
        }
      );

      self.parentCtrl.authenticationMethods = filteredMethods;

      if (filteredMethods.length > 0) {
        console.log(
          "autologin triggered with: " + filteredMethods[0].profileName
        );
        self.parentCtrl.handleLoginClick(filteredMethods[0]);
      } else {
        console.log(
          "no matching authmethod found for profile: " + targetProfile
        );
      }
    } else {
      console.log("this is mot working");
    }
  }
}

AutoLoginFirstOptionController.$inject = ["$scope"];

export let AutoLoginFirstOptionComponent = {
  name: "custom-automatic-login-first-option",
  config: {
    bindings: { parentCtrl: "<" },
    controller: AutoLoginFirstOptionController,
    template: "",
  },
  enabled: true,
  appendTo: "prm-login-after",
  enableInView: "^32KUL_LIBS:.*",
};
