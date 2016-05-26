angular.module('ddysys.controllers.managePatients', [])
  .controller('ManagePatientsCtrl', ManagePatientsCtrl);


ManagePatientsCtrl.$inject = ['$scope', '$rootScope', '$localStorage', 'PostData', '$http', 'badge', '$system'];
function ManagePatientsCtrl($scope, $rootScope, $localStorage, PostData, $http, badge, $system) {

  $scope.$on("$ionicView.enter", function () {
    $scope.user = $localStorage.getObject('user'); //需要实时，因为可能被修改，如头像
  });

  $scope.docSchedules = $localStorage.getObject('docSchedules') || [];
  $scope.userMessages = $localStorage.getObject('userMessages') || [];
  $scope.userMessages = [];
  $scope.init = init;
  $rootScope.initHome = $scope.init;
  $scope.changeBadge = changeBadge;

  function init() {
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
      });
      $scope.userMessages = data.umList;
      $localStorage.setObject('docSchedules', $scope.docSchedules || []);
      $localStorage.setObject('userMessages', $scope.userMessages || []);
      badge.set('home', data.yyys.messageCount);
      badge.set('patients', data.yyys.applyCount);
    })
  }

  function changeBadge(index, num) {
    $scope.userMessages[index].unreadCount = 0;
    if (num !== 0) badge.minus('home', num);
  }

}