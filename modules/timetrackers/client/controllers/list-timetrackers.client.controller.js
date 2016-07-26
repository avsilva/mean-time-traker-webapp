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
    vm.filterData = filterData;
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
    vm.project = {};

    if (vm.authentication.user.roles.indexOf('admin') !== -1){
      Admin.query(function (data) {
        vm.users = data;
      });
    }

    vm.projects = ProjectsService.query();


    var appendProject = function appendProject(p) {
      // You could substitue use of filter here with underscore etc.
      //p.project = $filter('filter')(projects, {_id: p.project})[0];
    };

    getPageData(vm.user._id, vm.project._id);
    getSumData();

    function getSumData(){
      vm.aggData = TimetrackersAggService.sum({ 'perPage': vm.pageSize, 'pageNumber': vm.currentPage });
      vm.aggData.$promise.then(function (result) {

        result.forEach(function(currentValue,index,arr){
          vm.pieDatacolumns.push({ 'id': currentValue._id._id, 'type': 'pie', 'name': currentValue._id.name });
          var dataPoints = {};
          dataPoints[currentValue._id._id] = currentValue.sumQuantity;
          vm.pieDatapoints.push(dataPoints);
        });
      });
    }

    function getPageData(_user, _project){

      vm.timetrackers = TimetrackersService.query({ 'perPage': vm.pageSize, 'pageNumber': vm.currentPage, 'userId': _user, 'projectId': _project });
      vm.timetrackers.$promise.then(function (result) {
        vm.timetrackers = result.Array;
        vm.totalTimeTrackers = result.TotalCount;
        //vm.timetrackers.forEach(appendProject);

        loadData(vm.timetrackers, function (column_chart_data, pie_chart_data) {

          //column chart data
          vm.datapoints = column_chart_data;

          //pie chart data
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
        var aDate = dateFilter(new Date(currentValue.start_date),'yyyy-MM-dd');

        if (hours_by_data[aDate] !== undefined){
          hours_by_data[aDate] = parseInt(currentValue.hours) + parseInt(hours_by_data[aDate]);
        } else {
          hours_by_data[aDate] = currentValue.hours;
        }

        if (hours_by_project[currentValue.projectid.name] !== undefined){
          hours_by_project[currentValue.projectid.name] = parseInt(currentValue.hours) + parseInt(hours_by_project[currentValue.projectid.name]);
        } else {
          hours_by_project[currentValue.projectid.name] = currentValue.hours;
        }

      });

      angular.forEach(hours_by_data, function(value, key) {
        b.push({ 'day': key, 'hours': value });
      });
      callback(b, hours_by_project);
      //$scope.a.push(date.toLocaleDateString());
    }

    function filterData(){
      getPageData(vm.user._id, vm.project._id);
    }



    function pageChanged(){
      getPageData(vm.user._id, vm.project._id);
      getSumData();
    }
  }



})();
