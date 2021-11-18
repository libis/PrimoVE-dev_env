import newsFeedTML from './newsFeed.html'

class NewsFeedController {
    constructor($scope,$ocLazyLoad,$injector) {
        console.log('constructor');
        var locale = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() ||  "en";
        var dm = new Date();
        dm.setHours(24, 0, 0, 0);
        $scope.maxfeeds = 3;
    
        $scope.feedresults = [];
    /*
        var filteredFeeds = feeds.filter(function (item) {
            return item.feedLang.indexOf(locale) >= 0;
        }); //feedLang equals locale language
        //console.log (filteredFeeds)
    
        for (var f = 0; f <= 10 && f < filteredFeeds.length; f++) {
            var feedConf = filteredFeeds[f];
            // console.log(feedConf.feedUrl)
            FeedService.parseFeed(feedConf).then(function (res) {
                //    console.log('----FeedService.parseFeed(feedConf) ---------------------')
                $scope.feedresults = $scope.feedresults.concat(res);
    
                FeedService.sortFeed($scope.feedresults);
            });
        }
    */
    }
}

NewsFeedController.$inject = ['$scope','$ocLazyLoad','$injector']

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
