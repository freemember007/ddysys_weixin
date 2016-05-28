(function () {
  'use strict';
  angular
    .module('ddysys.controllers.account', [])
    .controller('AccountCtrl', AccountCtrl)
    .controller('AccountRateCtrl', AccountRateCtrl)
    .controller('AccountBarcodeCtrl', AccountBarcodeCtrl)
    .controller('AccountTimetableCtrl', AccountTimetableCtrl)
    .controller('AccountInfoCtrl', AccountInfoCtrl)
    .controller('AccountSetCtrl', AccountSetCtrl)
    .controller('AccountModpwdCtrl', AccountModpwdCtrl);

  //我的Ctrl
  AccountCtrl.$inject = ['$scope', '$state', '$localStorage', 'PostData', '$http', '$ionicHistory', 'Api'];
  function AccountCtrl($scope, $state, $localStorage, PostData, $http, $ionicHistory, Api) {

    $scope.user = $localStorage.getObject('user');
    $scope.doctor = $localStorage.getObject('doctor');
    $scope.doLogout = doLogout;

    function doLogout() {
      if ($localStorage.get('assistenToken')) {
        $state.go('dock');
      } else {
        var postData = new PostData('applogout');
        $http.post('api', postData).then(
          function (data) {
            if (data) {
              $localStorage.clear();
              $ionicHistory.clearCache();
              $state.go('login')
            }
          });
      }
    }

  }

  // 评价Ctrl
  AccountRateCtrl.$inject = ['$scope', '$http', 'PostData', '$localStorage'];
  function AccountRateCtrl($scope, $http, PostData, $localStorage) {

    $scope.summary = $localStorage.getObject('rate_summary') || {};
    $scope.rates = $localStorage.getObject('rate_rates') || [];

    var postData = new PostData('appuserratelist');
    $http.post('api', postData).then(
      function (data) {
        if (data) {
          $scope.summary = data.userRate;
          $scope.rates = data.list;
          $localStorage.setObject('rate_summary', $scope.summary || {});
          $localStorage.setObject('rate_rates', $scope.rates || []);
        }
      });

    $scope.point2Arr = function (point) {
      var arr = new Array(5);
      for (var i = 0; i < point; i++) {
        arr[i] = true;
      }
      return arr;
    }
  }

  // 二维码Ctrl
  AccountBarcodeCtrl.$inject = ['$scope', '$http', '$localStorage'];
  function AccountBarcodeCtrl($scope, $http, $localStorage) {

    $scope.user = $localStorage.getObject('user');
    $scope.doctor = $localStorage.getObject('doctor');

  }

  // 出诊时间Ctrl
  AccountTimetableCtrl.$inject = ['$scope', '$http', 'PostData', '$rootScope'];
  function AccountTimetableCtrl($scope, $http, PostData, $rootScope) {

    var postData = new PostData('appdocScheme');
    postData.orgid = '157502';
    postData.docid = '32647';

    $http.post('api', postData).then(function (data) {
      if (!data) return;
      var list = data.list;
      var arr = [
        {day: '周一', am: false, pm: false, eve: false},
        {day: '周二', am: false, pm: false, eve: false},
        {day: '周三', am: false, pm: false, eve: false},
        {day: '周四', am: false, pm: false, eve: false},
        {day: '周五', am: false, pm: false, eve: false},
        {day: '周六', am: false, pm: false, eve: false},
        {day: '周日', am: false, pm: false, eve: false}
      ];

      if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
          var dateStr = list[i].schdate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
          var date = new Date(dateStr);
          var day = date.getDay();
          if (list[i].ampm === '1') {
            arr[day - 1].am = true;
          } else {
            arr[day - 1].pm = true;
          }
        }
      }

      $scope.schedules = arr;
    });

  }

  // 个人资料Ctrl
  AccountInfoCtrl.$inject = ['$scope', '$localStorage', 'Api'];
  function AccountInfoCtrl($scope, $localStorage, Api ) {

    $scope.user = $localStorage.getObject('user');
    $scope.doctor = $localStorage.getObject('doctor');
    $scope.modifyAvatar = modifyAvatar;

    function modifyAvatar(that) {
      var file = that.files[0];
      var params = {
        file: file,
        type: '1'
      };
      Api.upload('appuploadfile', params, function (resp) {
        var faceUrl = resp.data.filePath;
        Api.post('appmodperinfo', {faceUrl: faceUrl}).then(function(data){
          console.log(data.docInfo.dFaceUrl);
          $scope.doctor.dFaceUrl = data.docInfo.dFaceUrl;
          $localStorage.setObject('doctor', $scope.doctor);
        })
      });
    }

  }

  // 抢单设置Ctrl
  AccountSetCtrl.$inject = ['$scope', '$localStorage', 'Api'];
  function AccountSetCtrl($scope, $localStorage, Api) {

    $scope.user = $localStorage.getObject('user');
    $scope.currentSet = {
      BY: 0,
      YW: 0
    };
    $scope.alterSet = alterSet;
    var params = {
      did: $scope.user.did
    };
    
    function alterSet() {
      Api.post('appdocsetconsultpush', params).then(function(data){

      })
    }

  }

  // 修改密码Ctrl
  AccountModpwdCtrl.$inject = ['$scope','$state', '$http', 'PostData', '$md5', '$system'];
  function AccountModpwdCtrl($scope, $state, $http, PostData, $md5, $system) {

    $scope.modData = {};

    $scope.doModpwd = function () {
      var postData = new PostData('appresetpwd');
      postData.pwd = $md5.createHash($scope.modData.pwd);
      postData.newpwd = $md5.createHash($scope.modData.newpwd);
      $http.post('api', postData).then(function (data) {
        if (data && data.succ) {
          $system.toast('密码修改成功！');
          $state.go('tab.account');
        }
      })
    }

  }


})();



