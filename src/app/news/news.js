angular.module('ddysys.controllers.news', [])
  .controller('NewsCtrl', NewsCtrl)
  .controller('NewsDetailCtrl', NewsDetailCtrl);


NewsCtrl.$inject = ['$scope', 'News', '$ionicListDelegate', '$timeout'];
function NewsCtrl($scope, News, $ionicListDelegate, $timeout) {

  $scope.news = [];

  $scope.doRefresh = function () {
    var promise = News.all(0);
    promise.then(function (data) {
      $scope.news = data;
      // console.log($scope.news[0])
      $scope.$broadcast('scroll.refreshComplete');
      News.param.skip = 15; //复位
      News.param.hasmore = true; //同上
    }, function (data) {
      alert("查询失败: " + data);
    });
  };

  $scope.doRefresh();
  News.param.hasmore = true;
  $scope.loadMore = function () {
    $timeout(function () {
      if (!News.param.hasmore) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
    }, 1000);
    var promise = News.all(News.param.skip);
    promise.then(function (data) {
      $scope.news = $scope.news.concat(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      News.param.skip += 15;
      News.count().then(function (data) {
        if (News.param.skip >= data) {
          News.param.hasmore = false;
        }
      })
    }, function (data) {
      alert("查询失败: " + data);
    });
  };

  $scope.moreDataCanBeLoaded = function () {
    return News.param.hasmore;
  };

  $ionicListDelegate.showReorder(true);

}


NewsDetailCtrl.$inject = ['$scope', '$ionicLoading', '$stateParams', '$sce', 'Api', '$ionicPopup', '$state'];
function NewsDetailCtrl($scope, $ionicLoading, $stateParams, $sce, Api, $ionicPopup, $state) {

  $scope.title = $stateParams.title;
  $scope.contentString = '';
  // $scope.content = {};
  $scope.transship  = transship;

  $ionicLoading.show({
    template: '加载中...',
    noBackdrop: true,
    hideOnStateChange: true,
    duration: 5000
  });

  // var id = "09774f6c35";
  var id = $stateParams.newsId;

  Bmob.Cloud.run('fetchContent', {
    "objectId": id
  }, {
    success: function (result) {
      $scope.contentString = result;
      $scope.content = $sce.trustAsHtml(result);
      $ionicLoading.hide()
    },
    error: function (error) {
      alert(error);
      $ionicLoading.hide()
    }
  });

  function transship() {
    var ghPic = $scope.contentString.match(/http.*?(jpg|gif|png|bmp)/);
    Api.post('appadddocarticle',{
      ghArticleTitle: '[转载]' + $scope.title,
      ghArticleContent: $scope.contentString,
      ghPic: ghPic && ghPic[0]
    }).then(function (data) {
      $ionicPopup.alert({
        title: '提示',
        template: '转载成功!将跳转到转载后的文章,请点击微信右上角"..."进行分享。'
      }).then(function (res) {
        $state.go('article_detail', {articleId: data.obj.ghArticleId});
      });
    })
  }
}