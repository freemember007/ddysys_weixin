angular.module('ddysys.services')

.factory('Consults', Consults);

Consults.$inject = ['PostData', '$http', '$localStorage'];
function Consults(PostData, $http, $localStorage) {

  return {
    all: function (type) {
      var postData = new PostData('appconsultlist');
      postData.limit = 30; //todo:后续要加分页
      postData.type = type;
      // postData.deptCode = $localStorage.getObject('doctor').deptCode;
      return $http.post('api', postData);
    },
    get: function (id) {
      var postData = new PostData('appconsultinfo');
      postData.consultId = id;
      postData.limit = 100;
      return $http.post('api', postData);
    },
    reply: function (id, content) {
      var postData = new PostData('appconsultreplysave');
      postData.consultId = id;
      postData.replyContent = content;
      return $http.post('api', postData);
    }

  }

}