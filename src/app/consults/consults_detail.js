angular.module('ddysys.controllers.consultsDetail', [])
  .controller('ConsultsDetailCtrl', ConsultsDetailCtrl);

ConsultsDetailCtrl.$inject = ['$scope', '$rootScope', '$localStorage', 'Consults', '$stateParams', 'Api', '$ionicModal'];

function ConsultsDetailCtrl($scope, $rootScope, $localStorage, Consults, $stateParams, Api, $ionicModal) {

  $scope.consult = {};
  $scope.reply = {};
  $scope.user = $localStorage.getObject('user');
  $scope.doReply = doReply;
  $scope.callPatient = callPatient;
  $scope.callingModal = $ionicModal.fromTemplate(templates['src/app/templates/calling.html'], {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: true,
    hardwareBackButtonClose: false
  });

  init();

  function init() {
    Consults.get($stateParams.consultId).then(function (data) {
      if (!data) return;
      $scope.consult = data.userConsultForm;
      $scope.replies = data.list.reverse();

    })
  }
        
  // 回复
  function doReply() {
    Consults.reply($scope.consult.consultId, $scope.reply.content).then(function (data) {
      if (!data) return;
      init();
      $scope.reply.content = '';
    })
  }

  // 发起通话
  function callPatient(consultId) {
    $scope.callingModal.show();
    // Api.post('appdoccallpatforconsult', {consultId: consultId}).then(function(data){
    //
    // });
  }

}