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

    Api.post('getjssdkconf',{
      hosId:157510
    }).success(function(data){
      wx.config(data);
      wx.ready(function(){
        wx.onMenuShareTimeline({
          title: $scope.article.title,
          link: 'http://mp.teyangsoft.com/ddysys/#/article/' + currentUser.openid, // 分享链接
          imgUrl: 'http://mp.teyangsoft.com/HTML/'+$scope.src, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
            wxApi.http_request('qunfa', {
              hosId:157510,
              openid:currentUser.openid
            }).success(function(data) {
              console.log(data);
            });
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

        wx.onMenuShareAppMessage({
          title: $scope.article.title,
          desc: "我刚刚完成中医体质测试，挺准的，你也来测测吧", // 分享描述
          link: 'http://mp.teyangsoft.com/share.php?openid='+currentUser.openid, // 分享链接
          imgUrl: 'http://mp.teyangsoft.com/HTML/'+$scope.src, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            wxApi.http_request('qunfa', {
              hosId:157510,
              openid:currentUser.openid
            }).success(function(data) {
              console.log(data);
            });

          },
          cancel: function () {
            // 用户取消分享后执行的回调函数

          }
        });
      });
    });

  });

}