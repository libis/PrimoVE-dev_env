class LocationItemsHtmlController {
    constructor($scope,$element) {
        this.$scope = $scope;
        this.$element = $element;
    }

    $onInit() {
        let self = this
        // this.$element = $element; 
        
        self.parentCtrl = self.parentCtrl.parentCtrl;
       // this.inner = '';

        let componentWatcher = self.$scope.$watch(() => {
            //activate when user clicks on a location, creating a md-list-item            
            return self.$element.parent().parent().find('md-list-item').length;
           
        }, (n, o) => {
            if(n !== o){
                console.log(n);
                setTimeout(() => {
                    if ( self.$element.parent().parent().find('md-list-item').length > 0 ) {
                        let text = self.$element.parent().parent().find('md-list-item').find('div');
                        //replace innerHTML with innerText to enable html tags
                        if(text[5].innerText){
                            //console.log(text[5]);
                            text[5].innerHTML = text[5].innerText;
                        }                   
                    }
                }, 200);
            }
        });    
    }
}

LocationItemsHtmlController.$inject = ['$scope', '$element'];

export let locationItemsHtmlcomponent = {
    name: 'custom-location-items-html',
    enabled: true,
    appendTo: 'prm-location-items-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: LocationItemsHtmlController,
        template: ''
    }
}