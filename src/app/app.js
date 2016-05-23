angular.module('ddysys', [
  'ionic',
  'ddysys.services',
  'ddysys.services.api',
  'ddysys.services.news',
  'ddysys.services.util',
  'ddysys.directives',
  'ddysys.filters',
  'ddysys.controllers.login',
  'ddysys.controllers.home',
  'ddysys.controllers.messages',
  'ddysys.controllers.news',
  'ddysys.controllers.patients',
  'ddysys.controllers.register',
  'ddysys.controllers.reset_passwd',
  'ddysys.controllers.account',
  'ddysys.controllers.appointments',
  'ddysys.controllers.consults',
  'ddysys.controllers.events'
])
  .run(run)
  .config(config);


//--------- 运行 ---------//
run.$inject = ['$ionicPlatform', '$rootScope', '$ionicLoading', '$state', '$localStorage', '$ionicPopup'];
function run($ionicPlatform, $rootScope, $ionicLoading, $state, $localStorage, $ionicPopup) {
  $ionicPlatform.ready(function () {

    // 状态bar风格
    if (window.StatusBar) {
      // cordova-plugin-statusba required
      StatusBar.styleLightContent();
    }

    // 全局loading
    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({
        template: '请稍等...'
      })
    });
    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide()
    });

    // 全局alert
    $rootScope.$on('alert', function (d, data) {
      $ionicPopup.alert({
        title: '提示',
        template: data.msg + '（code: ' + data.code + '）'
      })
    });

    // 登录状态判断
    if ($localStorage.get('token')) {
      // $state.go('tab.home');
    } else {
      $state.go('login');
    }
  });
}


//--------- 配置 ---------//
config.$inject = ['$provide', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider'];
function config($provide, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  // 定义常量
  // $provide.constant('apiUrl', 'http://192.168.1.12:8004/app');
  // $provide.constant('apiUrl', 'http://192.168.0.140:8080/gh_ws_webfep/app');
  // $provide.constant('apiUrl', 'http://teyangnet.eicp.net:8004/app');
  // $provide.constant('apiUrl', 'http://183.129.141.106:8004/app');
  $provide.constant('apiUrl', 'http://ws.diandianys.com/app');

  // 不允许swipe返回
  $ionicConfigProvider.views.swipeBackEnabled(false);

  // 允许CORS请求
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // http拦截器
  $httpProvider.interceptors.push('Interceptor');

  //tab与nav风格
  // $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  // $ionicConfigProvider.tabs.style('standard');

  $urlRouterProvider.otherwise('/login');


  $stateProvider

  // tab组
    .state('tab', {
      url: '/tab',
      abstract: true,
      template: templates['src/app/home/tabs.html'],
      controller: 'tabCtrl'
    })


    // 首页
    .state('tab.home', {
      url: '/home',
      template: templates['src/app/home/home.html'],
      controller: 'HomeCtrl'
    })


    // 日程
    .state('events', {
      url: '/events/:patientId',
      template: templates['src/app/events/events.html'],
      controller: 'EventsCtrl'
    })
    .state('events_detail', {
      url: '/events/:eventId',
      template: templates['src/app/events/events_detail.html'],
      controller: 'EventsDetailCtrl',
      params: {
        event: null
      }
    })
    .state('addEvent', {
      url: '/addEvent/:patientId',
      template: templates['src/app/events/add_event.html'],
      controller: 'AddEventCtrl'
    })


    // 患者
    .state('tab.patients', {
      url: '/patients',
      template: templates['src/app/patients/patients.html'],
      controller: 'PatientsCtrl',
      // resolve: {
      //   patients: function(Patients){ //这样貌似很不健壮，如果Patients服务出问题，不会报错。
      //     return Patients.all()
      //   }
      // }
    })

    .state('patients_requests', {
      cache: false,
      url: '/patients/requests',
      template: templates['src/app/patients/patients_requests.html'],
      controller: 'PatientsRequestsCtrl'
    })

    .state('patients_requests_detail', {
      url: '/patients/requests/:patientId',
      template: templates['src/app/patients/patients_requests_detail.html'],
      controller: 'PatientsRequestsDetailCtrl'
    })

    .state('patients_detail', {
      url: '/patients/:patientId',
      template: templates['src/app/patients/patients_detail.html'],
      controller: 'PatientsDetailCtrl'
    })

    .state('patients_events', {
      url: '/events',
      template: templates['src/app/events/events.html'],
      // controller: 'PatientsChatCtrl',
    })

    // 消息
    .state('messages', {
      url: '/messages/:patientId',
      template: templates['src/app/messages/messages.html'],
      controller: 'MessagesCtrl',
      params: {
        msg: null
      }
    })

    // 咨询
    .state('tab.consults', {
      url: '/consults',
      template: templates['src/app/consults/consults.html'],
      controller: 'ConsultsCtrl',
      // resolve: {
      //   consults: function(Consults){
      //     return Consults.all()
      //   }
      // }
    })

    .state('consults_detail', {
      url: '/consults/:consultId',
      template: templates['src/app/consults/consults_detail.html'],
      controller: 'ConsultsDetailCtrl',
      // resolve: {
      //   consult: function(Consults, $stateParams){
      //     return Consults.get($stateParams.consultId)
      //   }
      // }
    })

    // 预约
    .state('appointments', {
      url: '/appointments',
      template: templates['src/app/appointments/appointments.html'],
      controller: 'AppointmentsCtrl',
    })

    .state('appointments_detail', {
      url: '/appointments/:appointmentId',
      template: templates['src/app/appointments/appointments_detail.html'],
      controller: 'AppointmentsDetailCtrl',
    })

    // 资讯
    .state('news', {
      url: '/news',
      template: templates['src/app/news/news.html'],
      controller: 'NewsCtrl',
    })

    .state('news_detail', {
      url: '/news/:newsId',
      template: templates['src/app/news/news_detail.html'],
      controller: 'NewsDetailCtrl',
      params: {
        title: null
      }
    })


    // 我
    .state('tab.account', {
      url: '/account',
      template: templates['src/app/account/account.html'],
      controller: 'AccountCtrl'
    })

    .state('account_rate', {
      url: '/account/rate',
      template: templates['src/app/account/account_rate.html'],
      controller: 'AccountRateCtrl'
    })

    .state('account_barcode', {
      url: '/account/barcode',
      template: templates['src/app/account/account_barcode.html'],
      controller: 'AccountBarcodeCtrl'
    })

    .state('account_timetable', {
      url: '/account/timetable',
      template: templates['src/app/account/account_timetable.html'],
      controller: 'AccountTimetableCtrl'
    })

    .state('account_info', {
      url: '/account/info',
      template: templates['src/app/account/account_info.html'],
      controller: 'AccountInfoCtrl'
    })

    .state('account_set', {
      url: '/account/set',
      template: templates['src/app/account/account_set.html'],
      controller: 'AccountSetCtrl'
    })

    .state('account_modpwd', {
      url: '/account_modpwd',
      template: templates['src/app/account/account_modpwd.html'],
      controller: 'AccountModpwdCtrl'
    })


    // 登录、注册、重置密码
    .state('login', {
      url: '/login',
      template: templates['src/app/login/login.html'],
      controller: 'LoginCtrl'
    })

    .state('dock', {
      url: '/dock',
      template: templates['src/app/login/dock.html'],
      controller: 'DockCtrl'
    })

    .state('register_verify', {
      url: '/register_verify',
      template: templates['src/app/register/register_verify.html'],
      controller: 'RegisterVerifyCtrl'
    })

    .state('register_agreement', {
      url: '/register_agreement',
      template: templates['src/app/register/register_agreement.html'],
    })

    .state('register', {
      url: '/register',
      template: templates['src/app/register/register.html'],
      controller: 'RegisterCtrl'
    })

    .state('register_upload', {
      url: '/register_upload',
      template: templates['src/app/register/register_upload.html'],
      controller: 'RegisterUploadCtrl'
    })

    .state('register_waiting', {
      url: '/register_waiting',
      template: templates['src/app/register/register_waiting.html'],
      controller: 'RegisterWaitingCtrl'
    })

    .state('reset_passwd_verify', {
      url: '/reset_passwd_verify',
      template: templates['src/app/reset_passwd/reset_passwd_verify.html'],
      controller: 'ResetPasswdVerifyCtrl'
    })

    .state('reset_passwd', {
      url: '/reset_passwd',
      template: templates['src/app/reset_passwd/reset_passwd.html'],
      controller: 'ResetPasswdCtrl'
    })

}


//--------- 模块宣扬及依存 ---------//
angular.module('ddysys.services', []);
angular.module('ddysys.filters', []);
angular.module('ddysys.directives', []);
angular.module('ddysys.controllers', []);

//--------- 全局函数 ---------//
Bmob.initialize("53458196b17f709cb6ff67247378a905", "49e3180d2d344c35e4e8a54ec4e72ec6");
// onerror
function onProfilePicError(ele) {
  ele.src = 'img/default_nomale_head_photo.png'
}