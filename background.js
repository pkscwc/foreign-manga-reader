// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var captureScreenshot, cropBase64Image, root, sendMessage;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('got request in background page!');
    if (request.screenshotCoordinates != null) {
      console.log("got screenshot coordinates");
      captureScreenshot(request.screenshotCoordinates);
    }
    if (request.takeScreenshot != null) {
      chrome.tabs.captureVisibleTab(null, {
        'format': 'png'
      }, sendResponse);
      return true;
    }
  });

  sendMessage = root.sendMessage = function(message) {
    console.log('sending message:');
    console.log(message);
    return chrome.tabs.getSelected(null, function(tab) {
      return chrome.tabs.sendMessage(tab.id, message);
    });
  };

  captureScreenshot = root.captureScreenshot = function(screenshotCoordinates) {
    console.log("capturing screenshot");
    sendMessage({
      'log': 'captureScreenshot did stuff!'
    });
    return chrome.tabs.captureVisibleTab(null, {
      'format': 'png'
    }, function(screenshotData) {
      console.log("cropping screenshot");
      cropBase64Image(screenshotData, screenshotCoordinates, function(croppedImage) {
        console.log("printing result of crop");
        console.log(croppedImage);
        return sendMessage({
          'screenshotResult': croppedImage
        });
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

}).call(this);
