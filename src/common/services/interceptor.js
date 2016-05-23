angular.module('ddysys.services')

  .factory('PostData', PostData)
  .factory('Token', Token)
  .factory('LocalUser', LocalUser)
  .factory('Interceptor', Interceptor);


PostData.$inject = ['$localStorage'];
function PostData($localStorage) {
  var PostData = function (service) {
    this.spid = '9920';
    this.channel = '13';
    this.random = '065c';
    this.sign = '5f54e74af1ec3276d298da5a15831170';
    this.format = 'JSON';
    this.oper = '127.0.0.1';
    this.token = $localStorage.get('token');
    this.service = service;
  };
  return PostData;
}


Token.$inject = ['$localStorage'];
function Token($localStorage) {
  return {
    get: function () {
      return $localStorage.get('token')
    },
    save: function (value) {
      $localStorage.save('token', value)
    },
    remove: (function () {
      $localStorage.remove('token')
    })
  }
}


LocalUser.$inject = ['$localStorage'];
function LocalUser($localStorage) {
  return {
    get: function () {
      return $localStorage.get('user')
    },
    save: function (value) {
      $localStorage.save('user', value)
    },
    remove: (function () {
      $localStorage.remove('user')
    })
  }
}


Interceptor.$inject = ['$rootScope', '$location', 'apiUrl'];
function Interceptor($rootScope, $location, apiUrl) {
  return {

    'request': function (config) {
      console.log('/---请求:' + config.data.service + '\n');
      console.log(config.data);
      console.log('------/\n\n\n');
      if (config.url === 'api') {
        // $rootScope.$broadcast('loading:show');
        NProgress.start();
        config.url = apiUrl;
        // console.log(config.data);
      }
      return config;
    },

    'requestError': function (rejection) {
      // $rootScope.$broadcast('loading:hide');
      NProgress.done();
      $rootScope.$broadcast('alert', {msg: '请求错误：' + rejection, code: 10001});
    },

    'response': function (res) {
      // $rootScope.$broadcast('loading:hide');
      NProgress.done();
      var data = res.data;
      console.log('/---响应\n');
      console.log(data);
      console.log('------/\n\n\n');
      if (res.config.url === apiUrl) {
        // console.log(data);
        if (angular.isObject(data) && data.code && !data.succ) {
          $rootScope.$broadcast('alert', data);
          if (/token不能为空|系统异常/.test(data.msg)) $location.path('/login');
        } else {
          return data; //处理接口正常返回
        }
      } else {
        return res; //处理其他正常返回
      }

    },

    'responseError': function (res) { //处理HTTP错误
      // $rootScope.$broadcast('loading:hide');
      NProgress.done();
      var status = res.status;
      if (status < 1) {
        $rootScope.$broadcast('alert', {msg: '网络连接异常！请检查您的网络连接！', code: status});
      } else if (status === 404) {
        $rootScope.$broadcast('alert', {msg: '请求的资源不存在！', code: status});
        $location.path('/notFound')
      } else if (status === 500) {
        $rootScope.$broadcast('alert', {msg: '服务器内部错误！', code: status});
        $location.path('/error')
      } else {
        $rootScope.$broadcast('alert', {msg: 'HTTP错误！', code: status});
      }
    }
  };
}
