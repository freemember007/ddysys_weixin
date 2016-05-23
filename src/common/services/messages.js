angular.module('ddysys.services')

  .factory('Messages', Messages);


Messages.$inject = ['PostData', '$http'];
function Messages(PostData, $http) {

  return {
    query: function (patientId, page) {
      var postData = new PostData('appmessagelist');
      postData.page = page || 1;
      postData.limit = 10;
      postData.patId = patientId;
      return $http.post('api', postData);
    },
    reply: function (patientId, msgType, msgContent) {
      var postData = new PostData('appsendmessage');
      postData.patId = patientId;
      postData.msgType = msgType;
      postData.msgContent = msgContent;
      return $http.post('api', postData);
    }

  }

}