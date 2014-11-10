var KEYS =  {
              backspace:  8,
              tab:        9,
              enter:      13,
              escape:     27,
              space:      32,
              up:         38,
              down:       40,
              comma:      188
            };

function replaceAll(str, substr, newSubstr) {
  if (!substr) {
      return str;
  }

  var expression = substr.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  return str.replace(new RegExp(expression, 'gi'), newSubstr);
}

function findInObjectArray(array, obj, key) {
  var item = null;
  for (var i = 0; i < array.length; i++) {
    // I'm aware of the internationalization issues regarding toLowerCase()
    // but I couldn't come up with a better solution right now
    if (safeToString(array[i][key]).toLowerCase() === safeToString(obj[key]).toLowerCase()) {
      item = array[i];
      break;
    }
  }
  return item;
}

function safeToString(value) {
  return angular.isUndefined(value) || value == null ? '' : value.toString().trim();
}

function encodeHTML(value) {
  return value.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
}