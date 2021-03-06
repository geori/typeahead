typeahead
=========

Typeahead directive for AngularJS

The code here is based on the wonderful [ngTagsInput](https://github.com/mbenford/ngTagsInput) library by [Michael Benford](https://github.com/mbenford).  I merely uncoupled the mbenford's code and made it work in a generic app.

## Requirements

 - AngularJS 1.2.1+ (v1.2.0 **is not** supported due to [an API change](https://github.com/angular/angular.js/commit/90f870) in Angular)
 - A modern browser
 
## Installing

- Download all the files in the /lib folder

## Example

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Typeahead App</title>
  <link rel="stylesheet" href="typeahead.css">

  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.min.js"></script>
  <script src="lib/typeahead.js"></script>
  <script src="lib/utilities.js"></script>
  
  <script>
    angular.module('TypeaheadApp', ['typeahead']);
    
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
## Alternatives

1. Angucomplete - https://github.com/darylrowland/angucomplete
2. ngStrap - http://mgcrea.github.io/angular-strap/
3. angular-ui - http://angular-ui.github.io/

If you're using Twitter Bootstrap, then I recommend going with ngStrap or AngularUI.  However, we don't use Bootstrap, so I needed a general purpose Typeahead/Autocomplete.
