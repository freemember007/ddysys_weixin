angular.module('ddysys.controllers.patients', [])

  .controller('PatientsCtrl', PatientsCtrl)
  .controller('PatientsDetailCtrl', PatientsDetailCtrl)
  .controller('PatientsRequestsCtrl', PatientsRequestsCtrl)
  .controller('PatientsRequestsDetailCtrl', PatientsRequestsDetailCtrl);


  //--------- 患者列表controller ---------//
PatientsCtrl.$inject = ['$scope', 'Patients', 'badge', '$rootScope', '$localStorage'];
function PatientsCtrl($scope, Patients, badge, $rootScope, $localStorage) {

  $scope.$on( "$ionicView.enter", function(){
    $scope.active('isTab2');
  });
  
  sortList(Patients.getLocal());

  $scope.refresh = function(){
    Patients.all().then(function(data) {
      $scope.$broadcast('scroll.refreshComplete');
      if(!data) return;
      var list = _.sortBy(data.docPatientVoList, 'patId');
      var count = _.countBy(list, {status: "0"}).true || 0; //如果没有匹配结果会返回undefined，这会引发后续错误，故或0
      badge.set('patients', count);
      sortList(list)
      Patients.setLocal(list);
    })
  };

  $scope.refresh();

  $rootScope.refreshPatients = $scope.refresh; //此方法较丑陋，后续应改成服务。

  function sortList(list){
    list = _.where(list, {status: "1"});
    // console.log(list)
    _.each(list, function(element){
        if(element.yhxb === '男'){
          element.faceUrl = element.faceUrl || 'img/default_male_head_photo1.png';
        } else {
          element.faceUrl = element.faceUrl || 'img/default_female_head_photo1.png';
        }
    });
    list = _.groupBy(list, function(item){
      return item.star;
    });
    $scope.patientsGroup = _.pairs(list).reverse();
  }

}


//--------- 患者详情controller ---------//
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
