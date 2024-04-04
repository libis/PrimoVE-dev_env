/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
angular.module('browzine', ['angularLoad']).run(['angularLoad', '$rootScope', '$translate', (angularLoad, $rootScope, $translate) => {


    let watcher = $rootScope.$watch(() => {
        try {
            if ($translate.instant('nui.customization.browzine.id') == 'nui.customization.browzine.id') {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    }, (n, o) => {
        if (n == true) {

            let apiId = $translate.instant('nui.customization.browzine.id');
            let apikey = $translate.instant('nui.customization.browzine.apikey');
            let journal = $translate.instant('nui.customization.browzine.journal');
            let issue = $translate.instant('nui.customization.browzine.issue');
            let article = $translate.instant('nui.customization.browzine.article');
            let downloadEnabled = $translate.instant('nui.customization.browzine.download_enable') == '1';
            let download = $translate.instant('nui.customization.browzine.download');
            let articlePDFDownloadViaUnpaywallText = $translate.instant('nui.customization.browzine.articlePDFDownloadViaUnpaywallText');
            let articleLinkViaUnpaywallText = $translate.instant('nui.customization.browzine.articleLinkViaUnpaywallText');
            let articleAcceptedManuscriptPDFViaUnpaywallText = $translate.instant('nui.customization.browzine.articleAcceptedManuscriptPDFViaUnpaywallText');
            let articleAcceptedManuscriptArticleLinkViaUnpaywallText = $translate.instant('nui.customization.browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText');
            
            window.browzine = {
              api: `https://public-api.thirdiron.com/public/v1/libraries/${apiId}`,
              apiKey: apikey,
              journalBrowZineWebLinkText: journal,
              articleBrowZineWebLinkText: issue,
              articlePDFDownloadLinkEnabled: downloadEnabled,
              articlePDFDownloadLinkText: download,
              articleLinkText: article,
              articlePDFDownloadViaUnpaywallText: articlePDFDownloadViaUnpaywallText,
              articleLinkViaUnpaywallText: articleLinkViaUnpaywallText,
              articleAcceptedManuscriptPDFViaUnpaywallText: articleAcceptedManuscriptPDFViaUnpaywallText,
              articleAcceptedManuscriptArticleLinkViaUnpaywallText: articleAcceptedManuscriptArticleLinkViaUnpaywallText,
              enableLinkOptimizer: false
            };

            angularLoad.loadScript('https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js').then(() => {
                console.log('browzine-primo-adapter.js loaded');
            });

            watcher();
        }

    });
}]);