angular.module('ddysys.filters')

  .filter('num2star', num2star)
  .filter('trust', trust)
  .filter('trustAsUrl', trustAsUrl)
  .filter('trustAsResourceUrl', trustAsResourceUrl);

function num2star() {
  return function (input) {
    return (input === '1') && '星标患者' || '普通患者';
  };
}

trust.$inject = ['$sce'];
function trust($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}


trustAsUrl.$inject = ['$sce'];
function trustAsUrl($sce) {
  return function (text) {
    return $sce.trustAsUrl(text);
  };
}

trustAsResourceUrl.$inject = ['$sce'];
function trustAsResourceUrl($sce) {
  return function (text) {
    return $sce.trustAsResourceUrl(text);
  };
}