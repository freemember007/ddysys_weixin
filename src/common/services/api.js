/**
 * Created by xjp on 16/5/16.
 */

angular.module('ddysys.services.api', [])
  .service('Api', Api);

Api.$inject = ['$localStorage', 'apiUrl', '$http'];
function Api($localStorage, apiUrl, $http) {

  this.baseParams = {
    'spid': '9920',
    'channel': '13',
    'sign': '5f54e74af1ec3276d298da5a15831170',
    'format': 'JSON',
    'random': '065c',
    'oper': '127.0.0.1',
    'token': $localStorage.get('token')
  };

  this.post = function (service, plusParams) {
    this.baseParams.service = service;
    var postParams = angular.extend({}, this.baseParams, plusParams);
    return $http.post(apiUrl, postParams);
  }

}
