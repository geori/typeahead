'use strict';

function TypeaheadDirective($document, $timeout, $sce) {

    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId, lastQuery, lastPromise;

        self.reset = function() {
          lastQuery     = null;
          lastPromise   = null;

          self.items    = [];
          self.visible  = false;
          self.index    = -1;
          self.selected = null;

          $timeout.cancel(debouncedLoadId);
        };

        self.show = function() {
          self.selected = null;
          self.visible  = true;
        };

        self.load = function(query) {
          if (query === lastQuery) {
            return;
          } else {
            lastQuery = query;
          }

          $timeout.cancel(debouncedLoadId);

          debouncedLoadId = $timeout(function() {
            self.query = query;

            var promise = loadFn({ $query: query });
            lastPromise = promise;

            promise.then(function(items) {
              if (promise !== lastPromise) {
                return;
              }
            
              self.items = items.slice(0, options.maxResultsToShow);

              if (self.items.length > 0) {
                self.show();
              } else {
                self.reset();
              }
            });
          }, options.debounceDelay, false);
        };
        self.selectNext = function() {
            self.select(++self.index);
        };
        self.selectPrior = function() {
            self.select(--self.index);
        };
        self.select = function(index) {
          if (index < 0) {
            index = self.items.length - 1;
          }
          else if (index >= self.items.length) {
            index = 0;
          }
          self.index    = index;
          self.selected = self.items[index];
        };

        self.reset();

        return self;
    }

    return {
        restrict: 'E',
        scope:{        
            source:"&",
            action:"&",
            displayProperty:"@",
            debounceDelay:"@",
            minLength:"@",
            highlightMatchedText:"@",
            maxResultsToShow:"@"
           },
        templateUrl: 'typeahead.html',
        link: function(scope, element, attrs) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down];
            var suggestionList, options, getDisplayText;
            var isHoveringOverSuggestions = false;

            // Defaults
            options = {
                        displayProperty:      scope.displayProperty       ||'text',
                        debounceDelay:        scope.debounceDelay         || 500,
                        minLength:            scope.minLength             || 3,
                        highlightMatchedText: scope.highlightMatchedText  || true,
                        maxResultsToShow:     scope.maxResultsToShow      || 10
                      };

            suggestionList        = new SuggestionList(scope.source, options);
            scope.suggestionList  = suggestionList;

            scope.selectionActionByIndex = function(index) {
              suggestionList.select(index);
              scope.action({ item: suggestionList.selected })
                    .then( function(){ suggestionList.reset(); });
            };

            getDisplayText = function(item) {
              return safeToString(item[options.displayProperty]);
            };

            scope.track = function(item) {
              return getDisplayText(item);
            }

            scope.highlight = function(item) {
              var text = getDisplayText(item);
              text = encodeHTML(text);
              if (options.highlightMatchedText) {
                  text = replaceAll(text, encodeHTML(suggestionList.query), '<em>$&</em>');
              }
              return $sce.trustAsHtml(text);
            };

            // --- Element Events ---

            element.on("mouseenter", function (event) {
              isHoveringOverSuggestions = true;
            });

            element.on("mouseleave", function (event) {
              isHoveringOverSuggestions = false;
            });



            // --- Form Input Events ---
            // typeahead directive must be located next to a sibling input element
            var inputField = element.parent().find('input');

            inputField.on("blur", function (event) {
              // Only reset if mouse is outside of typeahead and input
              if (!isHoveringOverSuggestions) {
                suggestionList.reset();     
                scope.$apply();
              }
            });

            inputField.on("focus search", function (event) {
              if (this.value && this.value.length >= options.minLength) {
                suggestionList.load(this.value);
              } else {
                suggestionList.reset();
                scope.$apply();
              }
            });

            inputField.on("keyup", function (event) {
              if (hotkeys.indexOf(event.keyCode) === -1) {
                if (this.value && this.value.length >= options.minLength) {
                  suggestionList.load(this.value);
                } else {
                  suggestionList.reset();
                  scope.$apply();
                }
              }

            });

            inputField.on("keydown", function (event) {
              var immediatePropagationStopped = false;

              event.stopImmediatePropagation = function() {
                immediatePropagationStopped = true;
                event.stopPropagation();
              };
              event.isImmediatePropagationStopped = function() {
                return immediatePropagationStopped;
              };

              var key = event.keyCode;

              if (hotkeys.indexOf(key) !== -1) {
                if (key === KEYS.down) {
                  suggestionList.selectNext();
                }
                else if (key === KEYS.up) {
                  suggestionList.selectPrior();
                }
                else if (key === KEYS.escape) {
                  suggestionList.reset();
                }
                else if (key === KEYS.enter || key === KEYS.tab) {
                  // Select it
                  scope.action({ item: suggestionList.selected })
                    .then( function(){ suggestionList.reset(); });
                }

                event.preventDefault();
                event.stopImmediatePropagation();
                scope.$apply();
              }

            });
        }
    };
}

angular.module('TypeaheadApp')
  .directive('typeahead', TypeaheadDirective);