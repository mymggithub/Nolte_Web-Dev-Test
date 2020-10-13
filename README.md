# Nolte_Web-Dev-Test
[Simple Design](https://nolte-venues-test.netlify.app/), [Second Design](https://nolte-venues-test.netlify.app/example.html)

Repository for building a venue web app using foursquare.  

The goal is to create a simple place to go web application connected to the foursquare API.
The requirements are mostly open, but is should be web based.

Simple


The features should include:
- An ability to find a venue based on location. 
- Geolocation detection for current location. 
- The ability to share their favorite places on social channels. 
- Responsive (looks great on all screen sizes).

I have two samples, one is index and the other is example.
I did this because I was itching to make it look better, also help illustrate the app.

Lets get started
I am using bootstrap, font-awesome, aos, angularjs and my code so you will need these in the header.```<head>```

Required-
```html
<link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
<link rel="stylesheet" href="assets/css/foursquare_simple.css">
<link rel="stylesheet" href="assets/css/styles.css">
```
After, for the angularjs to kick in, you will need to add this to the body
```html
<body ng-app="myapp" ng-controller="myCtrl">
```

I have a few custome elements using directives.

alert-box is you guessed it for displaying the alerts
I recomend puting it where it can expand 100% on the top.
```html
<alert-box></alert-box>
```



I did not create the search bar to be an element you can call, for a reason.
```html
<div class="container search-bar">
	<div class="search-form">
		<input type="text" name="search" placeholder="Venue...Cafe" ng-model="venueSearch" id="venueSearch" my-enter="findLocation()">
		<input type="text" name="search" placeholder="Near...San francisco" ng-model="nearlocation" id="searchNear" my-enter="findLocation()">
		<button class="btn btn-info search-btn" ng-click="findLocation()">Search</button>
	</div>
</div>
```
There are many ways to make a search bar and I  didnt want you to be limited to mine.
What is important is the search venue and location inputs need these.
```html
ng-model="venueSearch" my-enter="findLocation()"
```
```html
ng-model="nearlocation" my-enter="findLocation()"
```
And the search button needs 
```html
 ng-click="findLocation()"
```
to active it as well.

----note----
my-enter in the input element
```html
my-enter="findLocation()"
```
is for when you click enter on the keyboard to start the search.




Next we have show results
```html
<show-results></show-results>
```
It just shows that status of the results, I would say its optional.

After to get the results you have two ways to view the data.
as a table or as boxes.

table-
```html
<results-table></results-table>
```

boxes-
```html
<results-boxes></results-boxes>
```
It is recommended to put these into some kind of container, just to make sure you make sure to keep it dynamic
Also it helps to be able to manage the results, like using
```html
ng-hide="no_result"
```
to hide the results of your decorated text with it.


results-table has the abilty to sort data, so does results-boxes, but in order to activate is you will have to create the element with the attribute.
```html
ng-click="tableSort('Distance')"
```
or 
```html
ng-click="tableSort('Name')"
```
These are the only two options at the moment, the api is really empty.





Ok, now we are most done, these will be in the bottom portion of the page.

Snackbar is not an element, but just a way I toast small messages. 
```html
<div id="snackbar">{{notification_msg}}</div>
```
You can can say this is kind of oprional, as can get the notification_msg to use it for other stuff.

Then we are using modals, bootstraps to be precise and shoved it in 
```html
<modal></modal>
```
There is not enough data to be putting a lot on it, its just for show.


We have a loading element that is needed to show that the program is searching.
```html
<loading></loading>
```

Then we have the scripts that carry the weight, for this we need aos, jquery, bootstrap, and ours.
```html
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script src="assets/js/jquery.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.min.js"></script>
<script src="assets/js/foursquare_simple.js"></script>
```

Yay, congrats you made it.
This will make more sence looking at the index and example. 
