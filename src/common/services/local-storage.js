angular.module('ddysys.services')

  //--------- 本地存储 ---------//
  .factory('$localStorage', $localStorage);

$localStorage.$inject = ['$window'];
function $localStorage($window) {
  return {
    set: function (key, value) {
      $window.localStorage[key] = value;
    },
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function (key) {
      return $window.localStorage.removeItem(key);
    },
    setObject: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    clear: function () {
      $window.localStorage.clear();
    }
  }
}


