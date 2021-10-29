class RemoveDescForDbController {
    constructor($scope) {
        self = this
        this.$scope = $scope;
        this.parentCtrl = this.parentCtrl.parentCtrl;
        this.waitForPNX()
    }


    removeDescriptionIfDb() {
        if (self.parentCtrl.item.pnx.display.type.includes("database")) {

            for (var d in self.parentCtrl.details) {
                if (self.parentCtrl.details[d]) {
                    if (self.parentCtrl.details[d].label === "description") {
                        self.parentCtrl.details[d].values[0].values = ''
                    }
                }
            }
        }

    }


    waitForPNX() {
        let detailsWatcher = self.$scope.$watch(() =>
            self.parentCtrl.details,
            (newVal, oldVal) => {
                if (newVal[0]) {
                    detailsWatcher();
                    this.removeDescriptionIfDb()
                }
            }
        );
    }
}

RemoveDescForDbController.$inject = ['$scope'];

export let removeDescForDbcomponent = {
    name: 'custom-remove-desc-for-db',
    enabled: true,
    appendTo: 'prm-service-details-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: RemoveDescForDbController,
        template: ''
    }
}
