// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var assignVariable, callOnceElementAvailable, callOnceObjectAvailable, executeInPage, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  callOnceElementAvailable = root.callOnceElementAvailable = function(element, callback) {
    if ($(element).length > 0) {
      return callback();
    } else {
      return setTimeout(function() {
        return callOnceElementAvailable(element, callback);
      }, 300);
    }
  };

  callOnceObjectAvailable = root.callOnceObjectAvailable = function(objectname, callback) {
    if (window[objectname] != null) {
      return callback();
    } else {
      return setTimeout(function() {
        return callOnceObjectAvailable(objectname, callback);
      }, 300);
    }
  };

  executeInPage = root.executeInPage = function(myCode) {
    var scriptTag;
    scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = '(' + myCode + ')();';
    return document.documentElement.appendChild(scriptTag);
  };

  assignVariable = root.assignVariable = function(variableName, codeValue) {
    var codeValueAsText, scriptTag;
    codeValueAsText = codeValue.toString();
    scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = variableName + ' = ' + codeValueAsText + ';';
    return document.documentElement.appendChild(scriptTag);
  };

}).call(this);
