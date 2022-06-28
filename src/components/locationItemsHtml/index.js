class LocationItemsHtmlController {
    constructor($scope,$element,$compile) {
        self = this
        this.element = $element; 
        this.parentCtrl = this.parentCtrl.parentCtrl;
        this.inner = '';

        let componentWatcher = $scope.$watch(() => {
            //activate when user clicks on a location, creating a md-list-item            
            return $element.parent().parent().find('md-list-item').length;
           
        }, (n, o) => {
            if(n !== o){
                console.log(n);
                if ( $element.parent().parent().find('md-list-item').length > 0 ) {
                    let text = $element.parent().parent().find('md-list-item').find('div');
                    //replace innerHTML with innerText to enable html tags
                    if(text[5].innerText){
                        //console.log(text[5]);
                        text[5].innerHTML = text[5].innerText;
                    }                   
                }
            }
        });    
    }
}

LocationItemsHtmlController.$inject = ['$scope', '$element', '$compile'];

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