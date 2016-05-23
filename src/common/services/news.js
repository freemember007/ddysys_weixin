angular.module('ddysys.services.news', [])

  .factory('News', News);


News.$inject = ['$q'];
function News($q) {

  var List, query, param = {};
  param.hasmore = false;
  param.skip = 15;
  List = Bmob.Object.extend("List");
  query = new Bmob.Query(List);

  return {
    all: all,
    count: count,
    param: param
  };

  function all(skip) {
    var deferred = $q.defer();
    query.descending("createdAt");
    query.limit(15);
    query.skip(skip);
    query.find({
      success: function (results) {
        deferred.resolve(JSON.parse(JSON.stringify(results)));
        // alert("共查询到 " + results.length + " 条记录");
      },
      error: function (error) {
        deferred.reject(error);
        alert("查询失败: " + error.code + " " + error.message);
      }
    });
    return deferred.promise;
  }

  function count() {
    var deferred = $q.defer();
    query.count({
      success: function (count) {
        deferred.resolve(count);
      },
      error: function (error) {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }


}