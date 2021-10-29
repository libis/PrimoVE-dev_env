import linksContainerHTML from './linksContainer.html'

export let linksContainerPComponent = {
  name: 'custom-links-p-container',
  config: {
    template:linksContainerHTML
  },
  enabled: false,
  appendTo: 'prm-opac-after',
  enableInView: '.*',
}