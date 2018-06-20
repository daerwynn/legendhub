app.controller('itemshistory-controller', function($scope, $http, $location, itemConstants) {
	$scope.slots = itemConstants.slots;
	$scope.aligns = itemConstants.aligns;
	
	$scope.getItem = function() {
		$http({
			url: '/php/items/getItemByHistoryId.php',
			method: 'POST',
			data: {"id": getUrlParameter("id")}
		}).then(function succcessCallback(response) {
			$scope.item = response.data;
			$scope.item.ModifiedOn = (new Date(response.data.ModifiedOn + " UTC")).toString().slice(4, 24);
			$scope.item.Id = $scope.item.ItemId;
			$scope.getItemHistory();
		}, function errorCallback(response){

		});
	}

	$scope.getItemHistory = function() {
		$http({
			url: '/php/items/getItemHistory.php',
			method: 'POST',
			data: {"id": $scope.item.ItemId}
		}).then(function succcessCallback(response) {
			$scope.history = response.data.slice(0, 9);
			var i;
			console.log($scope.history)
			for (i = 0; i < $scope.history.length; i++) {
				$scope.history[i].ModifiedOn = (new Date($scope.history[i].ModifiedOn + " UTC")).toString().slice(4, 24);
			}
		}, function errorCallback(response){

		});
	}

	$scope.revert = function() {
		var postData = Object.assign({}, $scope.item);
		delete postData.ItemId;
		delete postData.MobName;
		delete postData.ModifiedOn;
		delete postData.ModifiedByIP;
		delete postData.ModifiedByIPForward;
		$http({
			url: '/php/items/updateItem.php',
			method: 'POST',
			data: postData
		}).then(function succcessCallback(response) {
			window.location = "/items/details.html?id=" + $scope.item.ItemId;
		}, function errorCallback(response){

		});
	}

	getUrlParameter = function(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	$scope.init = function() {
		$http({
			url: '/php/login/getLoggedInUser.php'
		}).then(function succcessCallback(response) {
			$scope.isLoggedIn = response.data.success;
			$scope.getStatInfo();
		}, function errorCallback(response) {

		});
		$scope.getStatInfo();
	}

	$scope.getStatInfo = function() {
		$http({
			url: '/php/items/getItemStats.php'
		}).then(function succcessCallback(response) {
			$scope.statInfo = response.data;

			// remove special items
			console.log($scope.statInfo);
			var i = $scope.statInfo.length;
			while (i--) {
				if ($scope.statInfo[i]['var'] == "Strength" ||
					$scope.statInfo[i]['var'] == "Mind" ||
					$scope.statInfo[i]['var'] == "Dexterity" ||
					$scope.statInfo[i]['var'] == "Constitution" ||
					$scope.statInfo[i]['var'] == "Perception" ||
					$scope.statInfo[i]['var'] == "Spirit" ||
					$scope.statInfo[i]['var'] == "Ac" ||
					$scope.statInfo[i]['var'] == "Value" ||
					$scope.statInfo[i]['var'] == "UniqueWear" ||
					$scope.statInfo[i]['var'] == "Rent" ||
					$scope.statInfo[i]['var'] == "NetStat") {
					$scope.statInfo.splice(i, 1);
				}
			}

			$scope.getItem();
		}, function errorCallback(response){
		});
	}

	$scope.showStat = function(item, stat) {
		if (stat['type'] == 'int' || stat['type'] == 'bool') {
			return item != 0;
		}

		if (stat['type'] == 'string') {
			return item != '' && item != null;
		}

		return false;
	}

	$scope.init();
});