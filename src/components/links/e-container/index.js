import linksContainerHTML from './linksContainer.html'

export let linksContainerEComponent = {
  name: 'custom-links-e-container',
  config: {
    template:linksContainerHTML
  },
  enabled: false,
  appendTo: 'prm-alma-viewit-items-after',
  enableInView: '.*',
}