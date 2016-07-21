(function () {
  'use strict';

  angular
  .module('timetrackers')
  .controller('TimetrackersListController', TimetrackersListController);

  TimetrackersListController.$inject = ['TimetrackersService', 'TimetrackersAggService', 'ProjectsService', '$filter', '$scope', '$interval', 'dateFilter', 'Authentication', 'Admin'];

  /*function dateStringToObject (data) {
  for(var i=0; i < data.length; i++ ){
  data[i].start_date = new Date(data[i].start_date);
}
return data;
}*/

  function TimetrackersListController(TimetrackersService, TimetrackersAggService, ProjectsService, $filter, $scope, $interval, dateFilter, Authentication, Admin) {

    var vm = this;
    vm.authentication = Authentication;
    vm.pageChanged = pageChanged;
    vm.setColaborator = setColaborator;
    vm.pageSize = 20;
    vm.currentPage = 1;
    vm.totalTimeTrackers = 0;

    vm.datapoints = [];
    vm.datacolumns = [{ 'id': 'hours', 'type': 'bar', 'name': 'Horas' }];
    vm.datax = { 'id': 'day' };
    vm.pieDatapoints = [];
    vm.pieDatacolumns = [];
    vm.pieDatapoints2 = [];
    vm.pieDatacolumns2 = [];
    vm.user = vm.authentication.user;

    if (vm.authentication.user.roles.indexOf('admin') !== -1){
      Admin.query(function (data) {
        vm.users = data;
      });
    }


    //var projects = ProjectsService.query();
    var appendProject = function appendProject(p) {
      // You could substitue use of filter here with underscore etc.
      //p.project = $filter('filter')(projects, {_id: p.project})[0];
    };

    getPageData(vm.user._id);
    getSumData();

    function getSumData(){
      vm.aggData = TimetrackersAggService.sum({ 'perPage': vm.pageSize, 'pageNumber': vm.currentPage });
      vm.aggData.$promise.then(function (result) {
        //console.log(result);
        result.forEach(function(currentValue,index,arr){
          vm.pieDatacolumns.push({ 'id': currentValue._id, 'type': 'pie', 'name': currentValue._id });
          var dataPoints = {};
          dataPoints[currentValue._id] = currentValue.sumQuantity;
          vm.pieDatapoints.push(dataPoints);
        });
      });
    }

    function getPageData(_user){

      vm.timetrackers = TimetrackersService.query({ 'perPage': vm.pageSize, 'pageNumber': vm.currentPage, 'userId': _user });
      vm.timetrackers.$promise.then(function (result) {
        vm.timetrackers = result.Array;
        vm.totalTimeTrackers = result.TotalCount;
        //vm.timetrackers.forEach(appendProject);

        loadData(vm.timetrackers, function (column_chart_data, pie_chart_data) {

          vm.datapoints = column_chart_data;

          vm.pieDatapoints2 = [];
          vm.pieDatacolumns2 = [];
          angular.forEach(pie_chart_data, function(value, key) {
            vm.pieDatacolumns2.push({ 'id': key, 'type': 'pie', 'name': key });
            var dataPoints = {};
            dataPoints[key] = value;
            vm.pieDatapoints2.push(dataPoints);
          });


        });
      });
    }

    function loadData (_arr, callback) {

      var hours_by_data = {}, b = [], hours_by_project = {};
      _arr.forEach(function(currentValue,index,arr){
        //console.log(currentValue);
        //var aDate = dateFilter(new Date(_arr.start_date),'yyyy-MM-dd hh:mm:ss');
        var aDate = dateFilter(new Date(currentValue.start_date),'yyyy-MM-dd');
        //var aDate = new Date(currentValue.start_date);

        if (hours_by_data[aDate] !== undefined){
          hours_by_data[aDate] = parseInt(currentValue.hours) + parseInt(hours_by_data[aDate]);
        } else {
          hours_by_data[aDate] = currentValue.hours;
        }

        if (hours_by_project[currentValue.project] !== undefined){
          hours_by_project[currentValue.project] = parseInt(currentValue.hours) + parseInt(hours_by_project[currentValue.project]);
        } else {
          hours_by_project[currentValue.project] = currentValue.hours;
        }

      });

      angular.forEach(hours_by_data, function(value, key) {
        b.push({ 'day': key, 'hours': value });
      });
      callback(b, hours_by_project);
      //$scope.a.push(date.toLocaleDateString());
    }

    function setColaborator(){
      getPageData(vm.user._id);
    }

    function pageChanged(){
      getPageData(vm.user._id);
      getSumData();
    }
  }



})();
