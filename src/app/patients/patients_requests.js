angular.module('ddysys.controllers.patientsRequests', [])

  .controller('PatientsRequestsCtrl', PatientsRequestsCtrl)
  .controller('PatientsRequestsDetailCtrl', PatientsRequestsDetailCtrl);

//--------- 患者请求列表controller ---------//
PatientsRequestsCtrl.$inject = ['$scope', 'Patients'];
function PatientsRequestsCtrl($scope, Patients) {

  Patients.all({status: 0}).then(function(data){
    if(!data) return;
    $scope.patients = data.docPatientVoList;
  })
}

//--------- 患者请求详情controller ---------//
PatientsRequestsDetailCtrl.$inject = ['$scope', 'Patients', '$stateParams', '$system', '$ionicHistory', '$rootScope', 'badge'];
function PatientsRequestsDetailCtrl($scope, Patients, $stateParams, $system, $ionicHistory, $rootScope, badge) {

  Patients.getById($stateParams.patientId).then(function(data){
    if(!data) return;
    $scope.patient = data.pat;
  });

  $scope.handleRequest = function(patientId, status){
    Patients.handleRequest(patientId, status).then(function(data){
      if(!data)return;
      badge.minus('patients');
      $system.toast(status === 1 ? '您接受了该患者。' : '您拒绝了该患者。');
      $ionicHistory.goBack();
      $rootScope.refreshPatients();
    })
  }

}
