class RequestMessageController {
    constructor($element, $translate) {
        this.element = $element[0];
        this.translate = $translate;
        
        this.form = angular.element(this.element.parentElement.parentElement.parentElement.parentElement).find('prm-request')[0];
        
        //params with default values:
        let params = { "feesUrl": "https:\/\/slsp.ch\/fees", "feesLinkText": '', "feesInfo": "" };
    }

    get feesInfo() {
        return this.translate.instant('customize.fullview.feesInfo');
    }

    get feesUrl() {
        return this.translate.instant('customize.fullview.feesUrl');
    }

    get feesLinkText() {
        return this.translate.instant('customize.fullview.feesLinkText');
    }

    //function for cloning info block into form
    $doCheck() {
        let form = false;
        if (this.form.children[1].children[1] !== undefined) {
            if (this.form.children[1].children[1].children[0] !== undefined) {
                form = this.form.children[1].children[1].children[0];
            }
        }
        else if (this.form.children[1].children[0] != undefined) {
            form = this.form.children[1].children[0].children[0];
        }
        if (form) {
            if (form.children.length == 2) {
                //remove bracket info (="see below") from request button:
                form.children[1].lastChild.firstChild.lastChild.innerHTML = form.children[1].lastChild.firstChild.lastChild.innerHTML.replace(/.\(.*\)/gi, '');
                //clone an insert info-block:

                let elem = document.createElement('span');
                elem.innerHTML = `
<div class="courier-info bar alert-bar">
    <div class="info-text">${this.feesInfo}</div>
    <div class="fees-link">
        <a ng-href="${this.feesUrl}" target="_blank">${this.feesLinkText}</a>
    </div>
</div>`;
                form.insertBefore(elem, form.children[1]);
            }
        }
    }
} 

RequestMessageController.$inject = ['$element', '$translate'];

export let requestMessagecomponent = {
    name: 'custom-request-message',
    enabled: true,
    appendTo: 'prm-request-services-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: RequestMessageController,
        template: ''
    }
}
