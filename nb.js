// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var cropBase64Image, getCurrentDialog, getLineNumFromText, getOCR, getRawTextForBubble, getTextForBubble, goToDialog, goToNextDialog, goToPreviousDialog, haveNewText, popupSentenceDisplay, positionPopup, prevScreenshotCoordinates, root, synthesizeSpeech, trimSelectedText;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.currentText = '';

  positionPopup = root.positionPopup = function() {
    var popupDialog, selectedBubble;
    selectedBubble = $('.selection.selected');
    if (!(selectedBubble != null) || selectedBubble.length === 0) return;
    popupDialog = $('.ui-dialog');
    if (!(popupDialog != null) || popupDialog.length === 0) return;
    console.log('setting offset!');
    return popupDialog.offset({
      'left': selectedBubble.offset().left,
      'top': selectedBubble.offset().top - Math.max(popupDialog.height() + 10, 150)
    });
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

  getCurrentDialog = function() {
    var i, x, _i, _len, _ref;
    _ref = $('.location-lens');
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      x = _ref[i];
      if ($(x).hasClass('selected')) return i;
    }
    return -1;
  };

  goToDialog = function(idx) {
    return $($('.location-lens')[idx]).click();
  };

  goToNextDialog = function() {
    var currentDialog;
    currentDialog = getCurrentDialog();
    if (currentDialog === -1) {
      return goToDialog(0);
    } else {
      return goToDialog(currentDialog + 1);
    }
  };

  goToPreviousDialog = function() {
    var currentDialog;
    currentDialog = getCurrentDialog();
    if (currentDialog <= 0) {
      return goToDialog(0);
    } else {
      return goToDialog(currentDialog - 1);
    }
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
    return selectedText.trim();
  };

  getRawTextForBubble = function(bubble_id) {
    if (isNaN(parseInt(bubble_id))) bubble_id = bubble_id.attr('id_item');
    return $('.location-lens[id_item=' + bubble_id + ']').find('.location-shortbody').text();
  };

  getTextForBubble = function(bubble_id) {
    var line, rawtext;
    rawtext = getRawTextForBubble(bubble_id);
    rawtext = ((function() {
      var _i, _len, _ref, _results;
      _ref = rawtext.split('\n');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.indexOf('lang=') !== 0 && line.indexOf('showenglish') !== 0) {
          _results.push(line);
        }
      }
      return _results;
    })()).join(' ');
    return trimSelectedText(rawtext);
  };

  $(document).ready(assignVariable('$', 'jQuery'), assignVariable('callOnceObjectAvailable', callOnceObjectAvailable), assignVariable('getLineNumFromText', getLineNumFromText), assignVariable('positionPopup', positionPopup), assignVariable('getTextForBubble', getTextForBubble), assignVariable('getRawTextForBubble', getRawTextForBubble), assignVariable('trimSelectedText', trimSelectedText), executeInPage(function() {
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
  }), $(document).keyup(function(e) {
    var focused, _ref;
    console.log(e);
    focused = $(':focus');
    if (focused.length > 0 && ((_ref = focused[0].type) === 'textarea' || _ref === 'input' || _ref === 'text')) {
      return false;
    }
    if (e.keyCode === 40) {
      goToNextDialog();
      return false;
    } else if (e.keyCode === 38) {
      goToPreviousDialog();
      return false;
    }
  }), callOnceElementAvailable('.active-view', function() {
    return $('.active-view').scroll(function() {
      return positionPopup();
    });
  }), root.serverLocation = 'http://geza.csail.mit.edu:1357', popupSentenceDisplay = $('<div id="popupSentenceDisplay">dialog content is here</div>'), popupSentenceDisplay.dialog({
    'autoOpen': false,
    'modal': false,
    'title': '',
    'position': ['left', 'top'],
    'zIndex': 99,
    'width': 'auto',
    'height': 'auto',
    'maxHeight': '100px',
    'max-height': '100px',
    'create': function() {
      return $(this).css("maxHeight", '100px').css('max-height', '100px');
    },
    'close': function() {
      var audioTag;
      audioTag = $('audio')[0];
      if (audioTag != null) return audioTag.pause();
    }
  }).css('max-height', '100px').css('maxHeight', '100px'), callOnceElementAvailable('.location-shortbody-text', function() {
    var lang, _i, _len, _ref, _results;
    _ref = ['zh', 'ja', 'fr', 'de'];
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
    if (request['screenshotResult'] != null) {
      console.log('screenshot result');
      console.log(request['screenshotResult']);
    }
    if ((request['executeHere'] != null) && (request['executeHere']["function"] != null) && (request['executeHere'].arglist != null)) {
      root[request['executeHere']["function"]].apply(request['executeHere'].arglist);
    }
    if (request['log'] != null) console.log(request['log']);
    return console.log(request);
  });

  synthesizeSpeech = root.synthesizeSpeech = function(sentence, lang) {
    var audioTag;
    audioTag = $('audio')[0];
    if (!audioTag) {
      $('body').append($('<audio>').attr('autoplay', true).attr('loop', true));
      audioTag = $('audio')[0];
    }
    audioTag.src = 'http://geza.csail.mit.edu:1357/synthesize?sentence=' + sentence + '&lang=' + lang;
    return audioTag.play();
  };

  haveNewText = function() {
    console.log(root.currentText);
    $('#popupSentenceDisplay').dialog('open');
    $('#popupSentenceDisplay').text('');
    $('#popupSentenceDisplay').css('width', 'auto');
    $('#popupSentenceDisplay').css('height', 'auto');
    $('.selection.selected').unbind('click', haveNewText);
    $('.selection.selected').bind('click', haveNewText);
    $('.location-lens.selected').unbind('click', haveNewText);
    $('.location-lens.selected').bind('click', haveNewText);
    $('.ui-dialog').css('z-index', 99);
    $('.ui-dialog').css('width', 'auto');
    $('.ui-dialog').css('height', 'auto');
    $('#popupSentenceDisplay').css('max-height', '500px');
    root.addSentence(root.currentText, root.selectedLanguage, $('#popupSentenceDisplay'), true, function() {
      return positionPopup();
    });
    return synthesizeSpeech(root.currentText, root.selectedLanguage);
  };

  getOCR = function(imagedata, callback) {
    var dataPrefix;
    dataPrefix = 'data:image/png;base64,';
    if (imagedata.indexOf(dataPrefix) === 0) {
      imagedata = imagedata.slice(dataPrefix.length);
    }
    return $.get(root.serverLocation + '/getOCR?data=' + imagedata, callback);
  };

  cropBase64Image = function(imgData, screenshotCoordinates, callback) {
    var canvas, context, imageObj;
    canvas = document.createElement('canvas');
    canvas.width = screenshotCoordinates.width;
    canvas.height = screenshotCoordinates.height;
    context = canvas.getContext('2d');
    imageObj = new Image();
    imageObj.width = screenshotCoordinates.width;
    imageObj.heigth = screenshotCoordinates.height;
    imageObj.onload = function() {
      context.drawImage(imageObj, screenshotCoordinates.left, screenshotCoordinates.top, screenshotCoordinates.width, screenshotCoordinates.height, 0, 0, screenshotCoordinates.width, screenshotCoordinates.height);
      return callback(context.canvas.toDataURL("image/png"));
    };
    return imageObj.src = imgData;
  };

  prevScreenshotCoordinates = null;

  setInterval(function() {
    var origOpacity, screenshotCoordinates, _ref;
    if ((_ref = root.selectedLanguage) !== 'zh' && _ref !== 'ja') return;
    if (!($('.ui-drawable-selection') != null) || !$('.ui-drawable-selection').offset || !($('.ui-drawable-selection').offset() != null)) {
      return;
    }
    screenshotCoordinates = {
      'left': $('.ui-drawable-selection').offset().left,
      'top': $('.ui-drawable-selection').offset().top,
      'width': $('.ui-drawable-selection').width(),
      'height': $('.ui-drawable-selection').height()
    };
    if (_.isEqual(screenshotCoordinates, prevScreenshotCoordinates)) return;
    prevScreenshotCoordinates = screenshotCoordinates;
    console.log('taking screenshot');
    console.log(screenshotCoordinates);
    origOpacity = $('.ui-drawable-selection').css('opacity');
    return $('.ui-drawable-selection').css('opacity', 0.0).promise().done(function() {
      return chrome.extension.sendMessage({
        'takeScreenshot': true
      }, function(screenshotData) {
        $('.ui-drawable-selection').css('opacity', origOpacity);
        console.log('screenshot data!');
        return cropBase64Image(screenshotData, screenshotCoordinates, function(croppedImage) {
          console.log("printing result of crop");
          console.log(croppedImage);
          return getOCR(croppedImage, function(ocrText) {
            var noteBodyNum, noteBodySelector, noteBodyText, ocrPrefix;
            console.log(ocrText);
            noteBodyNum = 0;
            noteBodySelector = $('.note-body');
            if ((noteBodySelector != null) && noteBodySelector.length > 0) {
              noteBodyText = noteBodySelector.text();
              noteBodyNum = getLineNumFromText(noteBodyText);
            }
            ocrPrefix = '';
            if (!isNaN(noteBodyNum)) {
              ocrPrefix = (parseInt(noteBodyNum) + 1) + ') ';
            }
            if ($('textarea').text() === '') {
              return $('textarea').text(ocrPrefix + ocrText);
            }
          });
        });
      });
    });
  }, 3000);

  setInterval(function() {
    var line, selectedText;
    selectedText = $('.note-body').html();
    if (!(selectedText != null)) return;
    selectedText = selectedText.split('<br>');
    selectedText = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = selectedText.length; _i < _len; _i++) {
        line = selectedText[_i];
        if (line.indexOf('lang=') !== 0 && line.indexOf('showenglish') !== 0) {
          _results.push(line);
        }
      }
      return _results;
    })()).join(' ');
    selectedText = $('<span>').html(selectedText).text();
    selectedText = trimSelectedText(selectedText);
    if (selectedText !== root.currentText) {
      root.currentText = selectedText;
      return haveNewText();
    }
  }, 300);

}).call(this);
