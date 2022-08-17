import newsFeedTML from './newsFeed.html'

class NewsFeedController {
    constructor($scope,$http) {
        var self = this;
        self.scope = $scope;
        var locale = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() ||  "en";
        // console.log (locale)

        $scope.maxfeeds = 3;
        $scope.feedresults = [];

        let feeds = [
            {
                feedUrl: "https://limo-libis.blogspot.com/feeds/posts/default",
                feedLang: ['en'],
                feedContentType: 'title',
                feedInst: "LIMO",
                feedFilter: [
                        { param: "entry.categories", value: "All Views" },
                        { param: "entry.categories", value: "Odisee" },
                        { param: "entry.categories", value: "KULeuven" },
                        { param: "entry.categories", value: "KU Leuven Association" }
                ]
            },
            {
                feedUrl: "https://limo-libis-nl.blogspot.com/feeds/posts/default",
                feedLang: ['nl'],
                feedContentType: 'title',
                feedInst: "LIMO",
                feedFilter: [
                        { param: "entry.categories", value: "All Views" },
                        { param: "entry.categories", value: "Odisee" },
                        { param: "entry.categories", value: "KULeuven" },
                        { param: "entry.categories", value: "KU Leuven Association" }
                ]
            }
        ];

        var feedEndpoint = (feeds.filter(feed => feed['feedLang'] == locale ) )[0]['feedUrl']

        feedEndpoint = feedEndpoint+"?alt=json-in-script&max-results=" + $scope.maxfeeds


//        console.log (feedEndpoint)


        $http.jsonp(feedEndpoint).then( function(res){
            var entries = res.data.feed.entry
              var daysBeforeToday = 30
            var d1 = new Date(Date.now() - daysBeforeToday * 24 * 60 * 60 * 1000)

            $scope.feedresults = entries.filter(entry => new Date(entry.updated.$t) > d1 )
            $scope.feedresults = $scope.feedresults.map( entry => { 
                // entry.updated.$t =  "today";  
                var date = new Date(entry.updated.$t) 
                const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
                entry.updated.$t = day +"/"+ month +"/" + year;
                entry.link = (entry.link.filter( link => link["rel"] == "alternate"))[0].href
                return entry
            })

            // console.log ($scope.feedresults)
          
        });
    }
}

NewsFeedController.$inject = ['$scope','$http']

export let newsFeedComponent = {
    name: 'custom-news-feed',
    config: {
        bindings: {parentCtrl: '<'},
        controller: NewsFeedController,
        template: newsFeedTML
    },
    enabled: true,
    appendTo: 'prm-news',
    enableInView: '.*'
}
