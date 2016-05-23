angular.module('ddysys.filters')

  .filter('num2star', num2star);

function num2star() {
  return function (input) {
    return (input === '1') && '星标患者' || '普通患者';
  };
}