function SearchController($scope, $q) {
  this.modes          = {};
  this.options        = {};
  this.lastSearch     = "";

  this.tags = [ {text:'bacon'},{text:'ham'},{text:'eggs'},{text:'cheese'},{text:'onions'},{text:'chili'},{text:'ketchup'},{text:'catsup'},
                {text:'herp'},{text:'derp'},{text:'serp'},{text:'perp'},{text:'twerp'} ];

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

  this.select = function(item) {
    var deferred    = $q.defer();
    this.lastSearch = item.text;

    deferred.resolve();
    return deferred.promise;
  };

}

angular.module('TypeaheadApp')
  .controller('SearchController', SearchController);