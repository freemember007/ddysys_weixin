angular.module('ddysys.services')

    .factory('badge', badge);

badge.$inject = ['$rootScope', '$localStorage'];
function badge($rootScope, $localStorage) {

  return {
    get: function (type, number) {
      $rootScope.badge = {};
      $rootScope.badge.home = Number($localStorage.get('badge-home')) || 0;
      $rootScope.badge.patients = Number($localStorage.get('badge-patients')) || 0;
    },
    set: function (type, number) {
      $rootScope.badge[type] = number;
      $localStorage.set('badge-' + type, $rootScope.badge[type]);
    },
    plus: function (type, number) {
      $rootScope.badge[type] += number || 1;
      $localStorage.set('badge-' + type, $rootScope.badge[type]);
    },
    minus: function (type, number) {
      $rootScope.badge[type] -= number || 1;
      $localStorage.set('badge-' + type, $rootScope.badge[type]);
    }

  }

}