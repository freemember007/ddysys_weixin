angular.module('ddysys.controllers.home', [])
  .controller('tabCtrl', tabCtrl)
  .controller('HomeCtrl', HomeCtrl)

//--------- tab controller ---------//
tabCtrl.$inject = ['$scope', '$state', '$rootScope', '$localStorage', 'badge'];
function tabCtrl($scope, $state, $rootScope, $localStorage, badge) {

  $scope.settings = {
    isTab1: true,
    isAssistent: false
  }

  badge.get();

  $scope.active = function (tab) {
    $scope.settings = {
      isTab1: false,
      isTab2: false,
      isTab3: false,
      isTab4: false
    }
    $scope.settings[tab] = true;
  }

  // 当前是否助理登录及相关用户信息，供4个子域使用

  $scope.$on("$ionicView.enter", function () {
    if ($localStorage.get('assistenToken')) {
      $scope.settings.isAssistent = true;
    } else {
      $scope.settings.isAssistent = false;
    }
    $scope.doctor = $localStorage.getObject('doctor'); //需要实时，因为可能被修改，如头像
  })

}


//--------- 首页 controller ---------//
HomeCtrl.$inject = ['$scope', '$rootScope', '$localStorage', 'PostData', '$http', 'badge', '$system'];
function HomeCtrl($scope, $rootScope, $localStorage, PostData, $http, badge, $system) {

  $scope.$on("$ionicView.enter", function () {
    $scope.active('isTab1');
    $scope.user = $localStorage.getObject('user'); //需要实时，因为可能被修改，如头像
  })


  $scope.init = function () {
    $scope.docSchedules = $localStorage.getObject('docSchedules') || [];
    $scope.userMessages = $localStorage.getObject('userMessages') || [];
    var postData = new PostData('appindex');
    $http.post('api', postData).then(function (data) {
      $scope.$broadcast('scroll.refreshComplete');
      if (!data) return;
      $scope.docSchedules = data.dsList.slice(0, 2);


      _.map(data.umList, function (item) {
        if (item.msgType === 'P') {
          item.msgContent = '[图片]';
        } else if (item.msgType === 'A') {
          item.msgContent = '[语音]';
        }
        // console.log(item.msgContent)
      })
      $scope.userMessages = data.umList;
      $localStorage.setObject('docSchedules', $scope.docSchedules || []);
      $localStorage.setObject('userMessages', $scope.userMessages || []);


      badge.set('home', data.yyys.messageCount);
      badge.set('patients', data.yyys.applyCount);
    })
  }

  $rootScope.initHome = $scope.init;

  // $scope.init();

  $scope.changeBadge = function (index, num) {
    $scope.userMessages[index].unreadCount = 0;
    if (num !== 0) badge.minus('home', num);
  }

}