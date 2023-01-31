import spotlightHTML from './spotlight.html'

class SpotlightController {
    constructor($scope, $http) {
        let self = this;

        const RSS_URL = `https://documentatiecentrumvb.blogspot.com/feeds/posts/default/?alt=rss`;
    
        fetch("https://api.rss2json.com/v1/api.json?rss_url=" + RSS_URL)
        .then((res) => res.json())
        .then((data) => {
    
          const res = data.items;
          //console.log(res);
          //const posts = res.filter(item => item.categories.length > 0) // That's the main trick* !
          const posts = res;
    
          function toText(node) {
           let tag = document.createElement('div')
           tag.innerHTML = node
           node = tag.innerText
           return node
        }
         function shortenText(text,startingPoint ,maxLength) {
         return text.length > maxLength?
            text.slice(startingPoint, maxLength):
            text
        }
    
        $scope.title = posts[0].title;
        $scope.description = toText(posts[0].description);
    
        var img = posts[0].thumbnail;  //Get thumnail image from rss feed
        console.log(img);
        $scope.img = 'https://1.bp.blogspot.com/-tcxIdAf5xwU/YDO8JM4qqJI/AAAAAAAAAAk/aZ_hBh8KfdkE_l4Lhlqd7r6RcH5TDwjAgCLcBGAsYHQ/s971/Holle%2Bwegen.jpg';
        if(img){
          img = img.replace(/\/s72\-c/, "");//replace /s72\-c with nothing
          $scope.img = img;
        }
    
        $scope.url = posts[0].linkL;
        });
    }
  }
  
  SpotlightController.$inject = ['$scope', '$http']
  
  export let spotlightConfig = {
    name: 'prm-spotlight',
    enabled: true,
    appendTo: null,
    enableInView: '.*',
    config: {
      bindings: { parentCtrl: '<' },
      controller: SpotlightController,
      template: spotlightHTML
    }
  }
  
  