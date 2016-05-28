/**
 * Created by xjp on 16/5/16.
 */

angular.module('ddysys.services.api', ['ngFileUpload'])
  .service('Api', Api);

Api.$inject = ['$localStorage', 'apiUrl', '$http', 'Upload', '$rootScope'];
function Api($localStorage, apiUrl, $http, Upload, $rootScope) {

  this.baseParams = {
    'spid': '9901',
    'channel': '13',
    'sign': '5f54e74af1ec3276d298da5a15831170',
    'format': 'JSON',
    'random': '065c',
    'oper': '127.0.0.1',
    'token': $localStorage.get('token')
  };

  this.post = function (service, plusParams) {
    this.baseParams.service = service;
    var postParams = angular.extend({}, this.baseParams, plusParams)
    return $http.post(apiUrl, postParams); //return一个对象,以便链式调用
  };

  this.upload = function (service, plusParams, callback) {
    this.baseParams.service = service;
    var postParams = angular.extend({}, this.baseParams, plusParams);
    var _apiUrl = apiUrl.replace('app', 'api');
     Upload.upload({
      url: _apiUrl,
      data: postParams
    }).then(function (resp) {
      callback(resp)
     }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
       $rootScope.$broadcast('loading:show');
    })
  }

}
