window.filterLinksService = {
    active: true,
    activate: () => {
        filterLinksService.active = true
    },
    init: (reqRes) => {
        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
    },
    removelinks: ({ docs = {}, type = "backlink" }) => {
        return docs.map(d => {
            delete d.pnx.links[type];
            return d
        });
    }
};

//angular.module('filterLinksService', ['ng']).run(() => {
   // document.addEventListener('pubSubInterceptorsReady', (e) => {
        pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
            enableInView = '32KUL_KUL:Lirias';
            if (new RegExp(enableInView).test(window.appConfig.vid)) {
                if (reqRes.data['docs']) {
                    reqRes.data['docs'] = filterLinksService.removelinks({ docs: reqRes.data['docs'], type: "backlink" });
                }
            }
            return reqRes;
        })
   // });
//});