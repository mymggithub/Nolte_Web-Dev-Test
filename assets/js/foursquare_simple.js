var myapp = angular.module('myapp', []);


myapp.directive("modal", function() {
	return {
		template :
`
<div>
	<div class="modal fade" role="dialog" tabindex="-1" id="modal1">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">{{details.name}}</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
				<div class="modal-body">
					<img ng-if="details.bestPhoto.prefix" src="{{details.bestPhoto.prefix}}300x500{{details.bestPhoto.suffix}}">
					<div ng-if="!details.bestPhoto.prefix">Sorry, no info found. <a ng-href="{{details.canonicalUrl}}" target="_blank">{{details.canonicalUrl}}</a></div>
				</div>
			</div>
		</div>
	</div>
</div>
`
	};
});


myapp.directive("resultsTable", function() {
	return {
		template : 
`
<table class="table results">
	<thead>
		<tr>
			<th>#</th>
			<th ng-if="has_distance" ng-click="tableSort('Distance')" >
				<span class="sort">
					Distance 
					<span ng-if="orderByField == 'location.distance'">
						<span ng-show="reverseSort"><i class="fa fa-sort-numeric-asc"></i></span>
						<span ng-show="!reverseSort"><i class="fa fa-sort-numeric-desc"></i></span>
					</span>
				</span>
			</th>
			<th ng-click="tableSort('Name')">
				<span class="sort">
					Place 
					<span ng-if="orderByField == 'name'">
						<span ng-show="reverseSort"><i class="fa fa-sort-alpha-desc"></i></span>
						<span ng-show="!reverseSort"><i class="fa fa-sort-alpha-asc"></i></span>
					</span>
				</span>
			</th>
			<th>Share</th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="result in results | orderBy :orderByField:reverseSort">
			<th scope="row" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-duration="1000">{{$index+1}}</th>
			<td ng-if="has_distance" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-duration="30000">{{result.location.distance}} meters</td>
			<td data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-duration="30000" class="place"><a href="{{result.link}}">{{result.name}}</a></td>
			<td data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-duration="30000" class="social">
				<a target="_blank" ng-href="https://www.facebook.com/sharer/sharer.php?u={{result.link}}"><i class="fa fa-facebook"></i></a>
				<a target="_blank" ng-href="https://twitter.com/home?status={{result.link}}"><i class="fa fa-twitter"></i></a>
				<a target="_blank" ng-href="https://plus.google.com/share?url={{result.link}}"><i class="fa fa-google-plus"></i></a>
				<span class="side-tooltip" ng-click="copyLnk(result.link,$event)"><i class="fa fa-link"></i></span>
			</td>
		</tr>
	</tbody>
</table>
`
	};
});

myapp.directive("resultsBoxes", function() {
	return {
		template : 
`
<div class="row justify-content-center results">
	<div class="col-sm-6 col-lg-4" ng-repeat="result in results | orderBy :orderByField:reverseSort">
		<div class="card clean-card text-center" data-aos="zoom-in-up" data-aos-anchor-placement="center-bottom" data-aos-duration="1000">
			<div class="card-body info">
				<h4 class="card-title"><a href="#" data-toggle="modal" data-target="#modal1" ng-click="getDetails(result.id)">{{result.name}}</a> | <a href="{{result.link}}" target="_blank"><i class="fa fa-external-link"></i></a></h4>
				<p class="card-text" ng-if="result.categories[0].name">{{result.categories[0].name}}</p>
				<p class="card-text" ng-if="!result.categories[0].name">Uncategorized</p>
				<p class="card-text">{{result.location.distance}} meters <a target="_blank" href="http://maps.google.com/maps?q={{result.location.lat}},{{result.location.lng}}"><i class="fa fa-map"></i></a></p>
				<div class="social">
					<a target="_blank" ng-href="https://www.facebook.com/sharer/sharer.php?u={{result.link}}"><i class="fa fa-facebook"></i></a>
					<a target="_blank" ng-href="https://twitter.com/home?status={{result.link}}"><i class="fa fa-twitter"></i></a>
					<a target="_blank" ng-href="https://plus.google.com/share?url={{result.link}}"><i class="fa fa-google-plus"></i></a>
					<span class="side-tooltip" ng-click="copyLnk(result.link,$event)"><i class="fa fa-link"></i></span>
				</div>
			</div>
		</div>
	</div>
</div>
`
	};
});

myapp.directive("showResults", function() {
	return {
		template : 
`
<span ng-show="searched">
	<span ng-hide="no_result">
		<caption>Search for <i>( {{search_val}} ) </i> <b>{{results.length}}</b> Search results</caption>
	</span>
</span>
`
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

myapp.directive("loading", function() {
	return {
		template :
`<div id="CSSloaderOverlay">
	<div id="CSSloader"></div>
</div>
`
	};
});

// function that is trigger on the enter key
myapp.directive('myEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.myEnter);
				});
				event.preventDefault();
			}
		});
	};
});
myapp.controller("myCtrl", function($scope, $http) {
	$scope.alert_msg = "There has been an error.";
	$scope.no_result = true;
	$scope.searched = false;


	$scope.getDetails = function(id="") {
		$http.get("https://api.foursquare.com/v2/venues/"+id+"?client_id=UCOSSBXHSTZ3UIAA4RKO5DPXCVJQEOG1NINJ1LDUNL0LEJ4F&client_secret=Q3CGAJFLKGOELNT3I3YPUAQKEHMI20CN4J2QDZGBHD433QDS&v=20180323").then(
			function(r) {
				console.log(r.data.response.venue.bestPhoto);
				$scope.details = r.data.response.venue;
			}, function() {})

	}


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
		// sets up the loading to let the user know its proccessing
		document.getElementById("CSSloaderOverlay").style.display = "block";
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
				$scope.no_result = false;
				// hides the loading
				document.getElementById("CSSloaderOverlay").style.display = "none";
				$scope.msg(r.data.response.venues.length+" results found");
				// the timeout is for to reset the AOS animation, because it is not detecting the new length of the page
				setTimeout(function() {
					AOS.init();
					// scrolls down to the results
					$([document.documentElement, document.body]).animate({
						scrollTop: $(".results").offset().top
					}, 2000);
				}, 1000);
			},
			function(r) {
				document.getElementById("CSSloaderOverlay").style.display = "none";
				$scope.msg("No results found");
				$scope.results = "";
				// foursquare is not advaced as google in deciphering near, so this is needed for errors
				// alert("Something went wrong, Please try a diffrent search or try another time.");
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
		$scope.no_result = true;
		$scope.searched = true;

		if ($scope.nearlocation==undefined || $scope.nearlocation == null) {$scope.nearlocation = "";}
		if ($scope.venueSearch==undefined || $scope.venueSearch == null) {$scope.venueSearch = "";}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
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
		} else {
			$scope.alertBox("Geolocation is not supported by this browser.");
		}
	}
});
AOS.init({ disable: 'mobile' });