class removeFacetCountController {
    constructor($element) { 
        this.$element = $element;
      }
    
      $onInit() {

        var s = document.createElement("style");
        s.setAttribute("id",  'style_removeFacetCount' );
        s.innerHTML = ""
        s.innerHTML = "div.facet-element-marker-lds13 span.facet-counter { display: none !important }";

        document.getElementsByTagName("primo-explore")[0].appendChild(s);
    
      }
}

removeFacetCountController.$inject = ['$scope'];

export let removeFacetCountConfig = {
    name: 'custom-remove-facet-count',
    enabled: true,
    appendTo: 'prm-facet-exact-after',
    enableInView: '32KUL_KUL:Lirias',
    config: {
        bindings: { parentCtrl: '<' },
        controller: removeFacetCountController,
        template: ''
    }
  }