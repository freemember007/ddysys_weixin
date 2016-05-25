angular.module('ddysys.controllers.tabs', [])
  .controller('TabsCtrl', TabsCtrl);

//--------- tab controller ---------//
TabsCtrl.$inject = ['$scope', 'badge'];
function TabsCtrl($scope, badge) {

  $scope.settings = {
    isTab1: true
  };

  badge.get();

  $scope.active = function (tab) {
    $scope.settings = {
      isTab1: false,
      isTab2: false,
      isTab3: false,
      isTab4: false
    };
    $scope.settings[tab] = true;
  };

}