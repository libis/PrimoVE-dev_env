import savedQueriesLlistHTML from './savedQueriesLlist.html'

class SavedQueriesLlistController {
  constructor($scope) {
    var self = this;

    let host = "limo.q.libis.be"

    let vid = "LUCA"

    let oldConf = {
      "32KUL_ACV:ACV" : {
        vid: "ACV"
      },
      "32KUL_TIFA:BOSA" : {
        vid: "ACV"
      },
      "32KUL_BPB:BPB" : {
        vid: "ACV"
      },
      "32KUL_DOCVB:docvlaamsbrabant" : {
        vid: "ACV"
      },
      "32KUL_VCV:FARO" : {
        vid: "ACV"
      },
      "32KUL_FIN:FODFIN" : {
        vid: "ACV"
      },
      "32KUL_GSB:GSB" : {
        vid: "ACV"
      },
      "32KUL_GSG:GSG" : {
        vid: "ACV"
      },
      "32KUL_IMEC:IMEC" : {
        vid: "ACV"
      },
      "32KUL_KADOC:KADOC" : {
        vid: "ACV"
      },
      "32KUL_KBC:KBC" : {
        vid: "ACV"
      },
      "32KUL_KMMR:KMKG" : {
        vid: "ACV"
      },
      "32KUL_RMCA:RMCA" : {
        vid: "ACV"
      },
      "32KUL_NBB:NBB" : {
        vid: "ACV"
      },
      "32KUL_RBINS:RBINS" : {
        vid: "ACV"
      },
      "32KUL_VES:VDIC" : {
        vid: "ACV"
      },
      "32KUL_VLP:VLP" : {
        vid: "ACV"
      },
      "32KUL_KUL:KULeuven": {
        vid: "KULeuven"
      },
      "32KUL_HUB:ODISEE": {
        vid: "ODISEE"
      },
      "32KUL_LUCAWENK:LUCA": {
        vid: "LUCA"
      },
      "32KUL_KHM:TMOREMA": {
        vid: "TMOREMA"
      },
      "32KUL_KHK:TMOREK": {
        vid: "TMOREK"
      },
      "32KUL_KHL:UCLL": {
        vid: "UCLL"
      },
      "32KUL_KATHO:VIVES": {
        vid: "VIVES"
      }
    }

    vid = oldConf[window.appConfig.vid].vid;

    /*
    let targetUrl = "https://"+ host +"/primo-explore/favorites?vid="+ vid +"&section=queries&from-new-ui=1&authenticationProfile=Profile+1"
    $scope.savedQueryUrl ="https://leuven-primo.hosted.exlibrisgroup.com/pds?func=load-login&calling_system=primo&institute="+ vid +"&lang=und&url=https://"+ host +":443/primo_library/libweb/pdsLogin?targetURL="+ encodeURIComponent( targetUrl )
    */

    $scope.savedQueryUrl = "https://"+ host +"/primo-explore/favorites?vid="+ vid +"&section=queries"

    console.log (self)
    console.log ($scope)

  }
}

SavedQueriesLlistController.$inject = ['$scope']

export let savedQueriesLlistConfig = {
  name: 'custom-saved-queries-list',
  enabled: true,
  appendTo: 'prm-saved-queries-list-after',
  enableInView: '.*',
  config: {
    bindings: { parentCtrl: '<' },
    controller: SavedQueriesLlistController,
    template:  savedQueriesLlistHTML
  }
}

