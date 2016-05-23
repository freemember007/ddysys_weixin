/**
 * Created by xjp on 16/5/16.
 */

angular.module('ddysys.services.api', [])
  .service('Api', Api);

Api.$inject = ['$localStorage', 'apiUrl', '$http'];
function Api($localStorage, apiUrl, $http) {

  this.baseParams = {
    'spid': '9920',
    'channel': '1',
    'sign': 'c559573c2589f78d376da8476edf946a',
    'format': 'JSON',
    'random': '1234',
    'oper': '127.0.0.1',
    'token': $localStorage.get('token')
  };

  this.post = function (service, plusParams) {
    this.baseParams.service = service;
    var postParams = angular.extend({}, this.baseParams, plusParams);
    return $http.post(apiUrl, postParams);
  }

}
