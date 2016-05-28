angular.module('ddysys.controllers.appointments', [])

  .controller('AppointmentsCtrl', AppointmentsCtrl)
  .controller('AppointmentsDetailCtrl', AppointmentsDetailCtrl)


//--------- 预约列表controller ---------//
AppointmentsCtrl.$inject = ['$scope', '$rootScope', 'Appointments', '$localStorage'];
function AppointmentsCtrl($scope, $rootScope, Appointments, $localStorage) {

  $scope.Appointments = $localStorage.getObject('appointments') || [];

  $scope.setType = function (type) {
    $scope.type = type;
    Appointments.all(type).then(function (data) {
      if (!data) return;
      $scope.appointments = data.list;
      if (type === '') $localStorage.setObject('appointments', $scope.appointments || []);
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.setType('');

  $rootScope.setAppointmentType = $scope.setType;

  $scope.formatDate = Appointments.formatDate;
  $scope.formatPStatus = Appointments.formatPStatus;

}


//--------- 预约详情controller ---------//
AppointmentsDetailCtrl.$inject = ['$scope', '$rootScope', 'Appointments', '$stateParams', '$ionicHistory', '$system', '$ionicPopup'];
function AppointmentsDetailCtrl($scope, $rootScope, Appointments, $stateParams, $ionicHistory, $system, $ionicPopup) {

  $scope.appointment = {};

  function init() {
    Appointments.get($stateParams.appointmentId).then(function (data) {
      if (!data) return;
      $scope.appointment = data.info;
    })
  }

  init();

  $scope.handle = function (id, pStatus, reason) {
    var confirmPopup = $ionicPopup.confirm({
      title: '提示',
      template: '您确定' + (pStatus === 'Y' ? '同意' : '拒绝') + '该预约请求?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        Appointments.handle(id, pStatus, reason).then(function (data) {
          $system.toast('已处理！');
          $ionicHistory.goBack();
          $rootScope.setAppointmentType(pStatus);
        })
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.formatDate = Appointments.formatDate;
  $scope.formatPStatus = Appointments.formatPStatus;

}