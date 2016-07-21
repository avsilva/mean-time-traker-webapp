(function () {
  'use strict';

  angular
  .module('timetrackers')
  .directive('dateFormat', dateFormat);

  dateFormat.$inject = [/*Example: '$state', '$window' */];

  function dateFormat(/*Example: $state, $window */) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function(modelValue){
          return new Date(modelValue);
        });
      }
    };
  }
})();
