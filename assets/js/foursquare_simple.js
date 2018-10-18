var myapp = angular.module('myapp', []);


myapp.directive("showResults", function() {
	return {
		template : "<caption>Search for <i>( {{search_val}} ) </i> <b>{{results.length}}</b> Search results</caption>"
	};
});

myapp.directive("alertBox", function() {
	return {
		template :
`<div class="alert">
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  {{alert_msg}}
</div>`
	};
});

myapp.controller("myCtrl", function($scope, $http) {
	$scope.alert_msg = "There has been an error.";
	$scope.alert_open = false;
	$scope.msg = function(msg) {
		$scope.notification_msg = msg;
		$("#snackbar").addClass("show");
		setTimeout(function(){ $("#snackbar").removeClass("show"); }, 3000);
	}
	$scope.alertBox = function(msg) {
		if ($scope.alert_msg != msg){
			$scope.alert_msg = msg;
			$scope.$apply(); // used to force the updates
			$(".alert").hide().slideDown( "slow" );
		}
	}
	// this is a function to copy to the clipboard
	$scope.copyLnk = function(lnk,e) {
		targetId = "_hiddenCopyText_";
		target = document.getElementById(targetId);
		// creates a textarea element and hides it from site 
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = e.clientY;
			target.id = targetId;
			document.body.appendChild(target);
		}
		// sends the string to be copied
		target.textContent = lnk;
		target.select();
		// does a test if its avalable to the browser 
		try {
			succeed = document.execCommand("copy");
			target.textContent = "";
			$scope.msg("Copied link");
		} catch(e) {
			$scope.msg("Unable to copy link");
		}
	}
	$scope.tableSort = function(col) {
		$scope.reverseSort = !$scope.reverseSort
		if (col == "Distance") {
			$scope.orderByField='location.distance'; 
		}else if (col == "Name"){
			$scope.orderByField = 'name';
		}
		setTimeout(function() {AOS.init({ disable: 'mobile' });}, 1000);
	};

	// this is to get search results, it is being called at the time after html5 geo api
	$scope.getSearch = function(lat="", lng="") {
		var appendLocation = "";
		if ($scope.nearlocation == "") {
			appendLocation = "&ll="+lat+","+lng;
		}else{
			appendLocation = "&near="+$scope.nearlocation.replace(/ /g, '+');
		}
		$http.get("https://api.foursquare.com/v2/venues/search?client_id=UCOSSBXHSTZ3UIAA4RKO5DPXCVJQEOG1NINJ1LDUNL0LEJ4F&client_secret=Q3CGAJFLKGOELNT3I3YPUAQKEHMI20CN4J2QDZGBHD433QDS&v=20180323"+appendLocation+"&query="+$scope.venueSearch).then(
			function(r) {
				for (var i = 0; i < r.data.response.venues.length; i++) {
					r.data.response.venues[i].link = "https://foursquare.com/v/"+r.data.response.venues[i].name.replace(/ /g, '-')+"/"+r.data.response.venues[i].id;
					if(r.data.response.venues[i].location.distance!=undefined){
						$scope.has_distance = true;
					}
				}
				$scope.results = r.data.response.venues;
				// the timeout is for to reset the AOS animation, because it is not detecting the new length of the page
				setTimeout(function() {AOS.init({ disable: 'mobile' });}, 1000);
			},
			function(r) {
				// foursquare is not advaced as google in deciphering near, so this is needed for errors
				alert("Something went wrong, Please try a diffrent search or try another time.");
			}
		);
	}

	// findLocation is for to use html5 geo api
	// findLocation is called everytime the sreach button is pressed
	$scope.findLocation = function() {
		$scope.orderByField = 'location.distance';
		$scope.reverseSort = false;
		$scope.search_val = $scope.venueSearch;
		$scope.has_distance = false;

		if ($scope.nearlocation==undefined || $scope.nearlocation == null) {$scope.nearlocation = "";}
		if ($scope.venueSearch==undefined || $scope.venueSearch == null) {$scope.venueSearch = "";}
		if (navigator.geolocation) {
			a= navigator.geolocation.getCurrentPosition(function(position) {
				$scope.getSearch(position.coords.latitude, position.coords.longitude);
			}, 
			// check for errors for the geo location
			function(error) {
				switch(error.code) {
					case error.PERMISSION_DENIED:
						$scope.alertBox("Geolocation has been denied, please enable to make use of the app.");
						break;
					case error.POSITION_UNAVAILABLE:
						$scope.alertBox("Location information is unavailable.");
						break;
					case error.TIMEOUT:
						$scope.alertBox("The request to get user location timed out.");
						break;
					case error.UNKNOWN_ERROR:
						$scope.alertBox("An unknown error occurred.");
						break;
				}
				$scope.getSearch();
			});
			console.log(a)
		} else {
			$scope.alertBox("Geolocation is not supported by this browser.");
		}
	}
});
AOS.init({ disable: 'mobile' });