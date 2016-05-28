angular.module('ddysys.controllers.messages', [])
  .controller('MessagesCtrl', MessagesCtrl);

//--------- 聊天controller ---------//
MessagesCtrl.$inject = [
  '$scope',
  '$ionicScrollDelegate',
  'Messages',
  '$stateParams',
  'PostData',
  '$http',
  '$ionicModal',
  '$timeout',
  'Api'
];
function MessagesCtrl($scope, $ionicScrollDelegate, Messages, $stateParams, PostData, $http, $ionicModal, $timeout, Api) {

  $scope.input = {
    message: $stateParams.msg || ''
  };
  $scope.sendMessage = sendMessage;
  $scope.sendImage = sendImage;
  $scope.loadMore = loadMore;
  var page = 1;
  $scope.messages = [];


  //初始化
  queryMsg(true);

  //加载消息
  function queryMsg(isFirst) {
    if (isFirst) page = 1;
    Messages.query($stateParams.patientId, page).then(function (data) {
      if (!data) return;
      var list = data.list;
      if (isFirst) {
        $scope.messages = list;
        $timeout(scrollBottom, 500);
      } else {
        $scope.messages = list.concat(messages);
        $scope.$broadcast('scroll.refreshComplete');
      }
      page++;
    });
  }

  //加载消息历史
  function loadMore() {
    queryMsg(false);
  }

  //滚动到底部
  function scrollBottom() {
    $ionicScrollDelegate.$getByHandle('main').scrollBottom(false);
  }

  // 发图片
  function sendImage(that) {
    var file = that.files[0];
    var params = {
      file: file,
      type: '6'
    };
    Api.upload('appuploadfile', params, function (resp) {
      var imageUrl = resp.data.filePath;
      $scope.sendMessage('P', imageUrl);
    });
  }
  
  // 发消息
  function sendMessage(type, content) {
    var postData = new PostData('appsendmessage');
    postData.patId = $stateParams.patientId;
    postData.msgType = type || 'T';
    postData.msgContent = content || $scope.input.message;
    $http.post('api', postData).then(function (data) {
      if (!data) return;
      $scope.input.message = '';
      queryMsg(true);
    })
  }

  // 放大图片
  $scope.zoomViewModal = $ionicModal.fromTemplate(templates['src/app/templates/zoom_view.html'], {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showZoomView = function(imageUrl) {
    $scope.ngSrc = imageUrl;
    $scope.zoomViewModal.show();
  };

  $scope.closeZoomView = function() {
    $scope.zoomViewModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.zoomViewModal.remove();
  });

}