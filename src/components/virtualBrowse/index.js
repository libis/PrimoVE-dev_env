class OpenVirtualBrowseInItemNewTabController {
    constructor($element) {
        $element.parent().parent().parent().attr("target","_blank")
    }
}

OpenVirtualBrowseInItemNewTabController.$inject = ['$element'];

export let openVirtualBrowseInItemNewTabConfig = {
    name: 'custom-open-virtual-browse-in-new-tab',
    enabled: true,
    appendTo: 'prm-virtual-browse-item-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: OpenVirtualBrowseInItemNewTabController,
        template: ''
    }
}
