angular.module('ddysys.controllers.articleDetail', [])
  .controller('ArticleDetailCtrl', ArticleDetailCtrl);


ArticleDetailCtrl.$inject = ['$scope', 'Api', '$stateParams', '$sce', '$localStorage'];
function ArticleDetailCtrl($scope, Api, $stateParams, $sce, $localStorage) {

  $scope.article = {};
  $scope.doctor = $localStorage.getObject('doctor');

  Api.post('appdocarticleinfo',{
    ghArticleId: $stateParams.articleId,
    isEncode: 0
  }).then(function (data) {
    $scope.article = data.info;
    $scope.article.title = data.info.ghArticleTitle;
    $scope.article.subTitle = '时间:'+ $scope.article.ghArticleTime + ' 阅读量:'+ $scope.article.ghArticleCount;
    $scope.article.content = $sce.trustAsHtml(data.info.ghArticleContent);

    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      window.shareData = {
        "timeLineLink": "http://localhost:3000/docArticle/" + $scope.article.ghArticleId,
        "sendFriendLink": "http://localhost:3000/docArticle/" + $scope.article.ghArticleId,
        "tTitle": $scope.article.title,
        "tContent": $scope.article.title,
        "fTitle": $scope.article.title,
        "fContent": $scope.article.title,
        "wContent": $scope.article.title
      };
      // 发送给好友
      WeixinJSBridge.on('menu:share:appmessage', function (argv) {
        WeixinJSBridge.invoke('sendAppMessage', {
          "img_url": "http://su.bdimg.com/static/superplus/img/logo_white.png",
          "img_width": "401",
          "img_height": "275",
          "link": window.shareData.sendFriendLink,
          "desc": window.shareData.fContent,
          "title": window.shareData.fTitle
        }, function (res) {
          _report('send_msg', res.err_msg);
        })
      });
      // 分享到朋友圈
      WeixinJSBridge.on('menu:share:timeline', function (argv) {
        WeixinJSBridge.invoke('shareTimeline', {
          "img_url": "http://su.bdimg.com/static/superplus/img/logo_white.png",
          "img_width": "401",
          "img_height": "275",
          "link": window.shareData.timeLineLink,
          "desc": window.shareData.tContent,
          "title": window.shareData.tTitle
        }, function (res) {
          _report('timeline', res.err_msg);
        });
      });

    }, false)

  });



}