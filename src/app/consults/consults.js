angular.module('ddysys.controllers.consults', [])

  .controller('ConsultsCtrl', ConsultsCtrl)
  .controller('ConsultsDetailCtrl', ConsultsDetailCtrl);

//--------- 咨询列表controller ---------//
ConsultsCtrl.$inject = ['$scope', '$rootScope', 'Consults', '$localStorage', '$state', 'Api', '$ionicPopup', '$ionicModal'];
function ConsultsCtrl($scope, $rootScope, Consults, $localStorage, $state, Api, $ionicPopup, $ionicModal) {

  // model
  $scope.user = $localStorage.getObject('user') || {}; //用户医生
  $scope.doctor = $localStorage.getObject('doctor') || {}; //业务医生
  $scope.consults = $localStorage.getObject('consults') || []; //咨询列表
  $scope.type = ''; //当前列表类型
  $scope.currentSnatchConsultId = ''; //当前抢单ID
  $scope.setDialTimeModal = $ionicModal.fromTemplate(templates['src/app/templates/setDialTime.html'], {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.answerCallTime = 1; //预约通话时间

  // 方法
  $scope.setType = setType;
  $rootScope.setConsultType = $scope.setType;
  $scope.showDetail = showDetail;
  $scope.snatchConsult = snatchConsult;
  $scope.setDialTime = setDialTime;

  // 初始化
  $scope.setType('DS');
  $scope.$on("$ionicView.enter", function () {
    $scope.active('isTab2');
  });

  function setType(type) {
    $scope.type = type;
    $rootScope.consultType = $scope.type;
    Consults.all(type).then(function (data) {
      if (!data) return;
      $scope.consults = data.list;
      if (type === 'DS') $localStorage.setObject('consults', $scope.consults || []);
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  function showDetail(consult) {
    if ($scope.type != 'YW') {
      $state.go('consults_detail', {consultId: consult.consultId});
    }
  }

  function snatchConsult(consult) {
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

  function setDialTime() {
    $scope.setDialTimeModal.hide();
    Api.post('appdocsetanswercalltime', {
      consultId: $scope.currentSnatchConsultId,
      answerCallTime: $scope.answerCallTime,
      serviceType: 'TELCONSULT'
    }).then(function (data) {
      $ionicPopup.alert({
        title: '提示',
        template: '预约成功! 系统将在10分钟后同时呼叫您与问诊人，来电号码为：4008004044，请保持手机畅通!'
      }).then(function (res) {
        console.log('预约成功!')
      });
    });
  }


}


//--------- 咨询详情controller ---------//

ConsultsDetailCtrl.$inject = ['$scope', '$rootScope', '$localStorage', 'Consults', '$stateParams', 'Api','$ionicPopup', '$ionicModal'];

function ConsultsDetailCtrl($scope, $rootScope, $localStorage, Consults, $stateParams, Api, $ionicPopup, $ionicModal) {

  $scope.consult = {};
  $scope.reply = {};
  $scope.user = $localStorage.getObject('user');
  $scope.doReply = doReply;
  $scope.callPatient = callPatient;
  $scope.callingModal = $ionicModal.fromTemplate(templates['src/app/templates/calling.html'], {
    scope: $scope,
    animation: 'slide-in-up'
  });

  init();

  function init() {
    Consults.get($stateParams.consultId).then(function (data) {
      if (!data) return;
      $scope.consult = data.userConsultForm;
      $scope.replies = data.list;
    })
  }

  function doReply() {
    Consults.reply($scope.consult.consultId, $scope.reply.content).then(function (data) {
      if (!data) return;
      init();
      $scope.reply.content = '';
      $rootScope.setConsultType($rootScope.consultType);
    })
  }

  function callPatient(consultId) {
    $scope.callingModal.show();
    // Api.post('appdoccallpatforconsult', {consultId: consultId}).then(function(data){
    //
    // });
  }

}