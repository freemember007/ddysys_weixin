angular.module('ddysys.controllers.patients', [])
  .controller('PatientsCtrl', PatientsCtrl);


PatientsCtrl.$inject = ['$scope', 'Patients', 'badge', '$rootScope'];
function PatientsCtrl($scope, Patients, badge, $rootScope) {

  $rootScope.refreshPatients = $scope.refresh; //todo:此方法较丑陋，后续应改成服务。
  $scope.refresh = refresh;
  var sortList = sortList;

  sortList(Patients.getLocal());
  $scope.refresh();

  function refresh() {
    Patients.all().then(function (data) {
      $scope.$broadcast('scroll.refreshComplete');
      if (!data) return;
      var list = _.sortBy(data.docPatientVoList, 'patId');
      var count = _.countBy(list, {status: "0"}).true || 0; //如果没有匹配结果会返回undefined，这会引发后续错误，故或0
      badge.set('patients', count);
      sortList(list);
      Patients.setLocal(list);
    })
  }

  function sortList(list){
    list = _.where(list, {status: "1"});
    list = _.groupBy(list, function(item){
      return item.star;
    });
    $scope.patientsGroup = _.pairs(list).reverse();
  }

}