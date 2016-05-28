angular.module('ddysys.controllers.consults', [])
  .controller('ConsultsCtrl', ConsultsCtrl);

ConsultsCtrl.$inject = ['$scope', 'Consults', '$localStorage', '$state', 'Api', '$ionicPopup', '$ionicModal'];
function ConsultsCtrl($scope, Consults, $localStorage, $state, Api, $ionicPopup, $ionicModal) {

  $scope.user = $localStorage.getObject('user') || {}; //用户医生
  $scope.doctor = $localStorage.getObject('doctor') || {}; //业务医生
  $scope.consults = []; //咨询列表
  $scope.type = ''; //当前列表类型
  $scope.currentSnatchConsultId = ''; //当前抢单ID
  $scope.answerCallTime = '1'; //预约通话时间
  $scope.setDialTimeModal = $ionicModal.fromTemplate(templates['src/app/templates/setDialTime.html'], {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: true,
    hardwareBackButtonClose: false
  });


  // 方法
  $scope.setType = setType;
  $scope.showDetail = showDetail;
  $scope.grabConsult = grabConsult;
  $scope.setDialTime = setDialTime;

  // 初始化
  $scope.setType('DS');

  function setType(type) {
    $scope.consults = $localStorage.getObject('consults') || [];
    $scope.type = type;
    Consults.all(type).then(function (data) {
      if (!data) return;
      $scope.consults = data.list;
      if (type === 'DS') $localStorage.setObject('consults', $scope.consults || []);
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  // 去详情页
  function showDetail(consult) {
    if ($scope.type != 'YW') {
      $state.go('consults_detail', {consultId: consult.consultId});
    }
  }

  // 抢单
  function grabConsult(consult) {
    Api.post('appdocreceiveconsult', {
      consultId: consult.consultId,
      did: $scope.user.did,
      docId: $scope.doctor.docId,
      hosId: $scope.doctor.hosId
    }).then(function (data) {
      if (data && data.succ == true) {
        consult.receiveStatus = 2;
        $scope.currentSnatchConsultId = consult.consultId,
          mentionSetDialTime();
      } else {
        mentionSetDialTime(); //todo:注释掉
        // alert('抢单失败, 下次手快一点哦!')
      }
    })
  }

  // 提醒设置通话时间
  function mentionSetDialTime() {
    $ionicPopup.confirm({
      title: '提示',
      template: '抢单成功, 需要预约通话时间吗?'
    }).then(function (res) {
      if (res) {
        $scope.setDialTimeModal.show();
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '您没有预约通话时间, 请稍后自行发起!'
        }).then(function (res) {
          $state.go('consults_detail', {consultId: $scope.currentSnatchConsultId});
        });
      }
    });
  }

  // 设置通话时间
  function setDialTime(answerCallTime) {
    $scope.setDialTimeModal.hide();
    Api.post('appdocsetanswercalltime', {
      consultId: $scope.currentSnatchConsultId,
      answerCallTime: answerCallTime,
      serviceType: 'TELCONSULT'
    }).then(function (data) {
      $ionicPopup.alert({
        title: '提示',
        template: '预约成功! 系统将在' + answerCallTime + '分钟后同时呼叫您与问诊人，来电号码为：4008004044，请保持手机畅通!'
      }).then(function (res) {
        console.log('预约成功!')
      });
    });
  }

}