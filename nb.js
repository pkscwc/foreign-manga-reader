// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var assignVariable, callOnceElementAvailable, callOnceObjectAvailable, executeInPage, getLineNumFromText, haveNewText, myGlobalCode, popupSentenceDisplay, root, trimSelectedText;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.currentText = '';

  callOnceElementAvailable = function(element, callback) {
    if ($(element).length > 0) {
      return callback();
    } else {
      return setTimeout(function() {
        return callOnceElementAvailable(element, callback);
      }, 300);
    }
  };

  myGlobalCode = function() {};

  callOnceObjectAvailable = function(objectname, callback) {
    if (window[objectname] != null) {
      return callback();
    } else {
      return setTimeout(function() {
        return callOnceObjectAvailable(objectname, callback);
      }, 300);
    }
  };

  executeInPage = function(myCode) {
    var scriptTag;
    scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = '(' + myCode + ')();';
    return document.documentElement.appendChild(scriptTag);
  };

  assignVariable = function(variableName, codeValue) {
    var codeValueAsText, scriptTag;
    codeValueAsText = codeValue.toString();
    scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = variableName + ' = ' + codeValueAsText + ';';
    return document.documentElement.appendChild(scriptTag);
  };

  getLineNumFromText = function(selectedText) {
    var lineNum, parenIndex, parenIndexes, x;
    parenIndexes = (function() {
      var _i, _len, _ref, _results;
      _ref = ')）';
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        if (selectedText.indexOf(x) !== -1) _results.push(selectedText.indexOf(x));
      }
      return _results;
    })();
    if (parenIndexes.length > 0) {
      parenIndex = Math.min.apply(Math, parenIndexes);
      lineNum = selectedText.slice(0, parenIndex).trim();
      if (!isNaN(lineNum)) return parseInt(lineNum);
    }
    return -1;
  };

  $(document).ready(assignVariable('callOnceObjectAvailable', callOnceObjectAvailable), assignVariable('getLineNumFromText', getLineNumFromText), executeInPage(function() {
    console.log('executing in page!');
    console.log(window);
    console.log(window['NB$']);
    window.foo = function() {
      return console.log(35);
    };
    window.callOnceObjectAvailable('NB$', function() {
      console.log(window.NB$.ui.notepaneView.prototype.options.loc_sort_fct);
      window.NB$.ui.notepaneView.prototype.options.loc_sort_fct = function(o1, o2) {
        var o1LineNum, o2LineNum;
        o1LineNum = getLineNumFromText(o1.body);
        o2LineNum = getLineNumFromText(o2.body);
        if (o1LineNum === o2LineNum) {
          return o1.right - o2.right;
        } else {
          if (o1LineNum === -1 || o2LineNum === -1) {
            return o1.right - o2.right;
          } else {
            return o1LineNum - o2LineNum;
          }
        }
      };
      return console.log(window.NB$.ui.notepaneView.prototype.options.loc_sort_fct);
    });
    return console.log('done executing in page');
  }), callOnceElementAvailable('.perspective', function() {
    $('.perspective').css('height', parseInt($('.perspective').css('height').split('px').join('')) - 150);
    return $('.perspective').css('top', parseInt($('.perspective').css('top').split('px').join('')) + 150);
  }), callOnceElementAvailable('.nb-viewport', function() {
    $('.nb-viewport').css('height', parseInt($('.nb-viewport').css('height').split('px').join('')) - 150);
    return $('.nb-viewport').css('top', parseInt($('.nb-viewport').css('top').split('px').join('')) + 150);
  }), root.serverLocation = 'http://geza.csail.mit.edu:1357', popupSentenceDisplay = $('<div id="popupSentenceDisplay">dialog content is here</div>'), popupSentenceDisplay.dialog({
    'autoOpen': false,
    'modal': false,
    'title': '',
    'position': ['right', 'top'],
    'zIndex': 99,
    'width': '100%',
    'maxHeight': '150px',
    'create': function() {
      return $(this).css("maxHeight", 150);
    }
  }).css('max-height', '150px'), callOnceElementAvailable('.location-shortbody-text', function() {
    var lang, _i, _len, _ref, _results;
    _ref = ['zh', 'ja'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      lang = _ref[_i];
      console.log(lang);
      console.log($('.location-shortbody-text').text());
      if ($('.location-shortbody-text').text().indexOf('lang=' + lang) !== -1) {
        root.selectedLanguage = lang;
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }));

  root.selectedLanguage = 'zh';

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request['selectedLanguage'] != null) {
      root.selectedLanguage = request['selectedLanguage'];
    }
    return console.log(request);
  });

  haveNewText = function() {
    console.log(root.currentText);
    $('#popupSentenceDisplay').dialog('open');
    $('#popupSentenceDisplay').text('');
    $('.ui-dialog').css('z-index', 99);
    $('#popupSentenceDisplay').css('max-height', '500px');
    return root.addSentence(root.currentText, root.selectedLanguage, $('#popupSentenceDisplay'));
  };

  trimSelectedText = function(selectedText) {
    var lineNum, parenIndex, parenIndexes, x;
    if (selectedText.indexOf('http://geza') !== -1) {
      selectedText = selectedText.slice(0, selectedText.indexOf('http://geza'));
    }
    parenIndexes = (function() {
      var _i, _len, _ref, _results;
      _ref = ')）';
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        if (selectedText.indexOf(x) !== -1) _results.push(selectedText.indexOf(x));
      }
      return _results;
    })();
    if (parenIndexes.length > 0) {
      parenIndex = Math.min.apply(Math, parenIndexes);
      lineNum = selectedText.slice(0, parenIndex).trim();
      if (!isNaN(lineNum)) selectedText = selectedText.slice(parenIndex + 1);
    }
    return selectedText;
  };

  setInterval(function() {
    var selectedText;
    selectedText = $('.note-body').text();
    selectedText = trimSelectedText(selectedText);
    if (selectedText !== root.currentText) {
      root.currentText = selectedText;
      haveNewText();
      return $('div.selection.selected').click(function() {
        return $('#popupSentenceDisplay').dialog('open');
      });
    }
  }, 300);

}).call(this);
