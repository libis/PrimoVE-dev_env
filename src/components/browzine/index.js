class BrowzineController {
    constructor($scope) {
        let self = this;
        let item = self.parentCtrl.parentCtrl.result;

        self.recordid = '';

        if (item && item.pnx && item.pnx.addata) {
            self.recordid = item.pnx.control.recordid[0];
        }

        let browzineWatcher = $scope.$watch(() => {
            return ((typeof window.browzine != "undefined") && (typeof window.browzine.primo === 'object') && (window.browzine.apiKey != "11111111-xxxx-xxxx-xxxx-111111111111"));
        }, (n, o) => {
            if (n == true) {
                console.log("trigger browzine for:", self.recordid)
                let scope = {
                    $ctrl: self.parentCtrl
                }
                window.browzine.primo.searchResult(scope);
                browzineWatcher();
            }
        });
    }
}

BrowzineController.$inject = ['$scope'];

export let browzineComponent = {
    name: 'custom-browzine',
    enabled: true,
    appendTo: 'prm-search-result-availability-line-after',
    enableInView: '^(?!32KUL_KUL:Lirias)',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: BrowzineController
    }
}