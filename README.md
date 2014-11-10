typeahead
=========

Typeahead directive for AngularJS

## Requirements

 - AngularJS 1.2.1+ (v1.2.0 **is not** supported due to [an API change](https://github.com/angular/angular.js/commit/90f870) in Angular)
 - A modern browser
 
## Installing

- Download all the files

## Usage

TBD

## Example

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Typeahead App</title>
  <link rel="stylesheet" href="typeahead.css">

  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.min.js"></script>
  <script src="utilities.js"></script>
  <script src="typeahead.js"></script>
  <script>
    angular.module('TypeaheadApp', []);
    
    function SearchController($scope, $q, $location) {
      this.modes          = {};
      this.options        = {};
      this.lastSearch = "";
      this.tags = [ {text:'bacon'},{text:'ham'},{text:'eggs'},{text:'cheese'},{text:'onions'},{text:'chili'},{text:'ketchup'},{text:'catsup'},
                    {text:'herp'},{text:'derp'},{text:'serp'},{text:'perp'},{text:'twerp'} ];
    
      // Must be a promise
      this.loadResults = function($query) {
        var deferred = $q.defer();
    
        var results = [];
        for(var i=0; i < this.tags.length; ++i) {
          if (this.tags[i].text.indexOf($query) > -1){
            results.push(this.tags[i]);
          }
        }
    
        deferred.resolve(results);
        return deferred.promise;
      };
    
      // Must be a promise
      this.select = function(item) {
        var deferred = $q.defer();
        this.lastSearch = item.text;
        deferred.resolve();
        return deferred.promise;
      };
    }
    
    angular.module('TypeaheadApp')
      .controller('SearchController', SearchController);
  </script>
  
</head>
<body ng-app="TypeaheadApp">
  <div ng-controller="SearchController as Search">
  
    <div>
      <input type="search" maxlength="100" ng-model="Search.query">
      <typeahead source="Search.loadResults(Search.query)" action="Search.select(item)"></typeahead>
    </div>

    <div ng-hide="Search.lastSearch === ''">
      <h3>Last Search was for '<em>{{Search.lastSearch}}</em>'</h3>
    </div>

  </div>
</body>
</html>
```
