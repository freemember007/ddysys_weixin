angular.module('ddysys.controllers.patientsDetail', [])
  .controller('PatientsDetailCtrl', PatientsDetailCtrl);

PatientsDetailCtrl.$inject = ['$scope', 'Patients', '$stateParams', '$system', '$rootScope'];
function PatientsDetailCtrl($scope, Patients, $stateParams, $system, $rootScope) {

  Patients.getById($stateParams.patientId).then(function(data){
    if(!data) return;
    $scope.patient = data.pat;
    $scope.stared = $scope.patient.star === '1' ? true : false;
  });

  $scope.star = function(patientId, stared){
    Patients.star(patientId, stared).then(function(data){
      if(!data) return;
      $system.toast(stared === true ? '收藏成功！' : '取消收藏成功！');
      $rootScope.refreshPatients();
    })
  }

}


