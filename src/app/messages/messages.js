angular.module('ddysys.controllers.messages', [])
  .controller('MessagesCtrl', MessagesCtrl);


//--------- 聊天controller ---------//
MessagesCtrl.$inject = [
  '$scope',
  '$ionicScrollDelegate',
  'Messages',
  '$stateParams',
  '$localStorage',
  'PostData',
  '$http',
  '$ionicModal',
  '$imageHelper',
  '$fileHelper',
  '$timeout',
  '$interval',
  '$system'
];
function MessagesCtrl($scope, $ionicScrollDelegate, Messages, $stateParams, $localStorage, PostData, $http, $ionicModal, $imageHelper, $fileHelper, $timeout) {

  $scope.user = $localStorage.getObject('user');
  $scope.toUser = _.findWhere($localStorage.getObject('patients'), {
    patId: Number($stateParams.patientId)
  });
  $scope.input = {};
  $scope.input.message = $stateParams.msg || '';
  var page = 1;
  var messages = [];

  //加载消息
  function queryMsg(isFirst) {
    if (isFirst) page = 1;
    Messages.query($stateParams.patientId, page).then(function (data) {
      if (!data) return;
      var list = _.sortBy(data.list, 'sentTime');
      _.map(list, function (message) {
        if (message.msgType === 'P') {

        } else if (message.msgType === 'A') {
        }
      });
      if (isFirst) {
        messages = list;
        $timeout(scrollBottom, 300);
      } else {
        messages = list.concat(messages);
        $scope.$broadcast('scroll.refreshComplete');
      }
      $scope.messages = messages;
      page++;
    });
  }

  function scrollBottom() {
    $ionicScrollDelegate.$getByHandle('main').scrollBottom(true);
  }

  queryMsg(true);

  //加载消息历史
  $scope.loadMore = function () {
    queryMsg(false);
  };

  // 放大图片

  $scope.zoomViewModal = $ionicModal.fromTemplate(templates['src/app/templates/zoom_view.html'], {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showZoomView = function(imageUrl) {
    $scope.ngSrc = imageUrl;
    $scope.zoomViewModal.show();
  }

  $scope.closeZoomView = function() {
    $scope.zoomViewModal.hide();
  }

  $scope.$on('$destroy', function() {
    $scope.zoomViewModal.remove();
  });


  // 发图片
  $scope.uploadImage = function () {
    $imageHelper.choose(function (status) {
      $imageHelper.getImage(status, function (imageUrl) {
        $fileHelper.upload(imageUrl, {
          service: 'appuploadimg',
          type: '6'
        }, function (res) {
          if (res && res.filePath) {
            $scope.sendMessage('P', res.filePath);
          }
        })
      })
    })
  }



  // 发消息
  $scope.sendMessage = function (type, content) {
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

}