'use strict'; 

angular.module('klikVote', ['ngResource', 'ui']).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/main', {templateUrl: '/views/Main.html', controller: MainCtrl, name:'Main'}).
		when('/stats', {templateUrl: '/views/Statistics.html', controller: StatsCtrl, name:'Statistics'}).
		when('/vote/:id', {templateUrl: '/views/Vote.html', controller: VoteCtrl, name:'Vote'}).
		otherwise({redirectTo: '/main'});
}]).
 directive('hichart', function () {
	return {
		restrict: 'A',
		transclude: true,
		controller: ChartCtrl,
		template: '<div></div>',
		replace: true,
		link: function (scope, element, attrs) {
			var chart1 = new Highcharts.Chart({
				chart: {
					renderTo: attrs.id,
					type: attrs.charttype,
					height: attrs.chartheight,
					animation: false
				},
				title: {
					text: attrs.title
				},
				xAxis: {
					categories: scope.chartCategories,
					labels: {
						step: scope.chartStep
					}
				},
				yAxis: {
					title: {
						text: attrs.ytitle
					}
				},
				series: [{
					data: scope.chartData,
					name: attrs.chartname
				}]
			});

			scope.$watch('users', function(){
				console.log('change');
				chart1.series = scope.chartData;
				chart1.redraw();
			});
		}
	};
})