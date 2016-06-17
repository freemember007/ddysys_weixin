angular.module('ddysys.controllers.articles', [])
  .controller('ArticlesCtrl', ArticlesCtrl);

ArticlesCtrl.$inject = ['$scope', '$localStorage', 'Api'];
function ArticlesCtrl($scope, $localStorage, Api) {

  $scope.doctor = $localStorage.getObject('doctor');
  $scope.articles = [];

  Api.post('appdocarticlelist', {
    ghDocinfoId: $scope.doctor.did
  }).then(function (data) {
    $scope.articles = data.list;
  })

}
