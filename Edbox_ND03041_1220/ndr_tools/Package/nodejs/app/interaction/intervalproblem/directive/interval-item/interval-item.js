/**
 * Created by lxq on 2015/7/29.
 */
define(['angularAMD',
], function (angularAMD) {
	angularAMD.directive('intervalItem', [function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'interaction/intervalproblem/directive/interval-item/interval-item.html',
			scope: { itemData: '=itemData', itemsData: '=itemsData', index: '=index', errorModel: '=errorModel' },
			controller: ['$scope', '$rootScope', '$timeout', '$filter', function ($scope, $rootScope, $timeout, $filter) {
				$scope.itemData.min.preNum = $scope.itemData.min.num;
				$scope.itemData.max.preNum = $scope.itemData.max.num;

				$scope.switchBraces = function ($event, data, type) {
					switch (type) {
						case 0:
						case 1:
							if (data.num === '')
								return;
							if (data.contain === "0") {
								data.contain = "1";
							} else {
								data.contain = "0";
							}
							break;
						case 2:
							if (data.addType === '0') {
								data.addType = '1'
							} else {
								data.addType = '0'
							}
							break;
					}

				}
				$scope.addInteval = function () {
					$scope.itemsData.push({ min: { num: '', contain: "0" }, max: { num: '', contain: "0" }, addType: '0' });
				}

				$scope.change = function (data) {
					data.num = $.trim(data.num);
					if ($scope.isNum(data.num)) {
						if (data.num !== '')
							data.num = data.num * 1;
						data.preNum = data.num;
					} else if (data.num === '-') {
						data.preNum = data.num;
					} else {
						$scope.errorModel.errorText = $filter('translate')('interval.validation.msg1');
						data.num = data.preNum;
					}
				}

				$scope.isNum = function (num) {
					if (num === '')
						return true;
					var r = new RegExp("^-?\\d+$");
					if (!r.test(num))
						return false;
					if (-20 > num || num > 20)
						return false;
					return true;
				}

				$scope.blur = function (data) {
					data.num = $.trim(data.num);
					if (!$scope.isNum(data.num)) {
						$scope.errorModel.errorText = $filter('translate')('interval.validation.msg1');
						data.num = '';
						data.preNum = '';
					}
					if (data.num === '') {
						data.contain = "0";
					}

				}
				$scope.deleteItem = function () {
					var next = $scope.itemsData[$scope.index + 1];
					if ($scope.index === 0 && next) {
						next.addType = '';
					}
					$scope.itemsData.splice($scope.index, 1);
				}
			}]
		};
	}])
});