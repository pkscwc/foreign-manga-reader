// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var autoResize, captureScreenshot, cropBase64Image, currentLanguage, doOncePageLoads, finishedLoading, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  autoResize = root.autoResize = function(id) {
    var newheight, newwidth;
    if (document.getElementById) {
      newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
      newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
    }
    document.getElementById(id).height = newheight + "px";
    document.getElementById(id).width = newwidth + "px";
    return $('#' + id).iframeAutoHeight();
  };

  finishedLoading = false;

  doOncePageLoads = function() {
    return console.log('loaded');
  };

  currentLanguage = 'zh';

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var lineNum, parenIndex, parenIndexes, selectedHTML, selectedText, x;
    console.log(sender.tab);
    if ((request.selectedText != null) && request.selectedText.length > 0) {
      $('#sentenceDisplay').html('');
      return addSentence(request.selectedText, currentLanguage);
    } else if ((request.selectedHTML != null) && request.selectedHTML.length > 0) {
      selectedHTML = request.selectedHTML;
      if (selectedHTML.indexOf('<a href="http://geza') !== -1) {
        selectedHTML = selectedHTML.slice(0, selectedHTML.indexOf('<a href="http://geza'));
      }
      selectedText = $('<span>').html(selectedHTML).text();
      parenIndexes = (function() {
        var _i, _len, _ref, _results;
        _ref = ')）';
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (selectedText.indexOf(x) !== -1) {
            _results.push(selectedText.indexOf(x));
          }
        }
        return _results;
      })();
      if (parenIndexes.length > 0) {
        parenIndex = Math.min.apply(Math, parenIndexes);
        lineNum = selectedText.slice(0, parenIndex).trim();
        if (!isNaN(lineNum)) selectedText = selectedText.slice(parenIndex + 1);
      }
      $('#sentenceDisplay').html('');
      return addSentence(selectedText, currentLanguage);
    } else if (request.screenshotCoordinates != null) {
      console.log("got screenshot coordinates");
      return captureScreenshot(request.screenshotCoordinates);
    }
  });

  captureScreenshot = function(screenshotCoordinates) {
    console.log("capturing screenshot");
    return chrome.tabs.captureVisibleTab(null, {
      'format': 'png'
    }, function(screenshotData) {
      console.log("cropping screenshot");
      cropBase64Image(screenshotData, screenshotCoordinates, function(croppedImage) {
        console.log("printing result of crop");
        return console.log(croppedImage);
      });
      return chrome.tabs.executeScript(null, {
        'file': 'setNoteBodyBackToNormal.js'
      });
    });
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

  document.addEventListener('DOMContentLoaded', function() {
    console.log('content loaded!');
    return now.ready(function() {
      return chrome.tabs.executeScript(null, {
        'file': 'browserexec.js'
      });
    });
  });

  /*
  document.addEventListener('DOMContentLoaded', () ->
    setTimeout(() ->
      addSentence('是我们银河系的近邻。', 'zh')
    , 5000)
    #newIframe = $('')
    #$('body').append(newIframe)
    #$.get('http://geza.csail.mit.edu:1357/?lang=zh&sentence=是我们银河系的近邻。', (data) ->
    #  $('body').html(data)
    #)
  )
  */


}).call(this);
