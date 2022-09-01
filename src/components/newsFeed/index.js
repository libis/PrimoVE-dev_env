/*
  KULeuven/LIBIS (c) 2022
  Tom Vanmechelen

  The news feeds or filtered based on tags (entry.categories)
  Tag "ALL": entry appears in all views
  Tag "nui.customization.newsfeed.views_linked_to_tag.ASSOC": entry appears in views of KULeuven Association ("32KUL_HUB:ODISEE","32KUL_KATHO:VIVES","32KUL_KHK:TMOREK","32KUL_KHL:UCLL","32KUL_KHM:TMOREMA","32KUL_KUL:KULeuven","32KUL_LUCAWENK:LUCA","32KUL_KUL:REGIONAL")
  Tag "nui.customization.newsfeed.views_linked_to_tag.LIBISNET": entry appears in views : "32KUL_ACV:ACV","32KUL_BPB:BPB","32KUL_DOCVB:docvlaamsbrabant","32KUL_FIN:FODFIN","32KUL_GSB:GSB","32KUL_GSG:GSG","32KUL_IMEC:IMEC","32KUL_KADOC:KADOC","32KUL_KBC:KBC","32KUL_KMMR:KMKG","32KUL_NBB:NBB","32KUL_RBINS:RBINS","32KUL_RMCA:RMCA","32KUL_TIFA:BOSA","32KUL_VCV:FARO","32KUL_VES:VDIC","32KUL_VLP:VLP", 
  Tag "nui.customization.newsfeed.views_linked_to_tag.CDI": entry appear in view of inst with CDI "32KUL_HUB:ODISEE","32KUL_KATHO:VIVES","32KUL_KHK:TMOREK","32KUL_KHL:UCLL","32KUL_KHM:TMOREMA","32KUL_KUL:KULeuven","32KUL_LUCAWENK:LUCA"
  
 
 */


import newsFeedTML from './newsFeed.html'

class NewsFeedController {
    constructor($scope, $http, $translate, $rootScope) {
        var self = this;
        self.$scope = $scope;
        self.$http = $http;
        
        self.$rootScope = $rootScope;
        self.locale = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() || "en";

        // console.log (locale)

        self.$scope.maxfeeds = 3;
        self.$scope.feedresults = [];

        self.feeds = [
            {
                feedUrl: "https://limonews-libis-en.blogspot.com/feeds/posts/default",
                feedLang: ['en'],
                feedContentType: 'title',
            },
            {
                feedUrl: "https://limonews-libis-fr.blogspot.com/feeds/posts/default",
                feedLang: ['fr'],
                feedContentType: 'title',
            },
            {
                feedUrl: " https://limo-help.blogspot.com/feeds/posts/default",
                feedLang: ['nl'],
                feedContentType: 'title',
            }
        ];



        let watcher =  self.$rootScope.$watch(() => {
            try {
                if (
                    $translate.instant('nui.customization.newsfeed.views_linked_to_tag.ASSOC') == 'nui.customization.newsfeed.views_linked_to_tag.ASSOC' ||
                    $translate.instant('nui.customization.newsfeed.views_linked_to_tag.ASSOC') == 'ASSOC'

                ) {
                    return false;
                } else {
                    return true;
                }
            } catch (e) {
                return false;
            }
        }, (n, o) => {
            if (n == true) {
                self.translate = $translate;
                self.processFeed(self);
                watcher();
            }
        });
    };

    processFeed() {
        var self = this

        var feedEndpoint = (self.feeds.filter(feed => feed['feedLang'] == self.locale))[0]['feedUrl']
        feedEndpoint = feedEndpoint + "?alt=json-in-script&max-results=10"
        self.$http.jsonp(feedEndpoint).then(function (res) {
            var entries = res.data.feed.entry
            var daysBeforeToday = 30
            var d1 = new Date(Date.now() - daysBeforeToday * 24 * 60 * 60 * 1000)

            self.$scope.feedresults = entries.filter(entry => new Date(entry.updated.$t) > d1)
            self.$scope.feedresults = self.$scope.feedresults.map(entry => {
                // entry.updated.$t =  "today";  
                var date = new Date(entry.updated.$t)
                const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
                entry.updated.$t = day + "/" + month + "/" + year;
                entry.link = (entry.link.filter(link => link["rel"] == "alternate"))[0].href
                return entry
            })

            // console.log(self.$scope.feedresults)

            self.$scope.feedresults = self.$scope.feedresults.filter(entry => {
                // console.log(entry)
                if ( entry.category == undefined){
                    return true
                }
                entry.category = entry.category.filter(category => {
                    // console.log(category.term)
                    if (category.term.toUpperCase() == "ALL") {
                        // console.log("show this entry")
                        return true
                    }
                    if (window.appConfig.vid.toUpperCase().match(new RegExp("32KUL_.*:" + category.term.toUpperCase(), "g"))) {
                        // console.log("show this entry")
                        return true
                    } 
                    if ( self.translate.instant('nui.customization.newsfeed.views_linked_to_tag.' + category.term.toUpperCase() ) != category.term.toUpperCase()) {
                        var views = (self.translate.instant('nui.customization.newsfeed.views_linked_to_tag.' + category.term.toUpperCase() )).split(',') 
                        if ( views.includes(window.appConfig.vid) ) {
                            //console.log("show this entry")
                            return true
                        }
                    }
                    return false
                });
                // console.log(entry.category)  
                return (entry.category.length > 0);
            });


            self.$scope.feedresults = self.$scope.feedresults.slice(0, self.$scope.maxfeeds);
        });
    }
}
        


NewsFeedController.$inject = ['$scope', '$http', '$translate', '$rootScope']

export let newsFeedComponent = {
    name: 'custom-news-feed',
    config: {
        bindings: { parentCtrl: '<' },
        controller: NewsFeedController,
        template: newsFeedTML
    },
    enabled: true,
    appendTo: 'prm-news',
    enableInView: '.*'
}
