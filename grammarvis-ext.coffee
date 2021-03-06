root = exports ? this

autoResize = root.autoResize = (id) ->
    if(document.getElementById)
        newheight=document.getElementById(id).contentWindow.document .body.scrollHeight
        newwidth=document.getElementById(id).contentWindow.document .body.scrollWidth
    document.getElementById(id).height = (newheight) + "px"
    document.getElementById(id).width = (newwidth) + "px"
    $('#' + id).iframeAutoHeight()

finishedLoading = false

doOncePageLoads = () ->
  console.log 'loaded'
  #addSentence('是我们银河系的近邻。', 'zh')

currentLanguage = 'zh'

chrome.extension.onMessage.addListener((request, sender, sendResponse) ->
  #console.log(sender.tab)
  #if (request.greeting == "hello")
  #  sendResponse({farewell: "goodbye"})
  if request.selectedText? and request.selectedText.length > 0
    #$('body').html(request.greeting)
    $('#sentenceDisplay').html('')
    addSentence(request.selectedText, currentLanguage)
  else if request.selectedHTML? and request.selectedHTML.length > 0
    selectedHTML = request.selectedHTML
    if selectedHTML.indexOf('<a href="http://geza') != -1
      selectedHTML = selectedHTML[...selectedHTML.indexOf('<a href="http://geza')]
    selectedText = $('<span>').html(selectedHTML).text()
    parenIndexes = (selectedText.indexOf(x) for x in ')）' when selectedText.indexOf(x) != -1)
    if parenIndexes.length > 0
      parenIndex = Math.min.apply(Math, parenIndexes)
      lineNum = selectedText[...parenIndex].trim()
      if not isNaN(lineNum)
        selectedText = selectedText[parenIndex+1..]
    $('#sentenceDisplay').html('')
    addSentence(selectedText, currentLanguage)
  #else if request.screenshotCoordinates?
  #  console.log "got screenshot coordinates"
  #  captureScreenshot(request.screenshotCoordinates)
  #else if request.takeScreenshot
  #  console.log 'taking screenshot'
  #  chrome.tabs.executeScript(null, {'file': 'setNoteBodyWhite.js'})
)

captureScreenshot = (screenshotCoordinates) ->
  console.log "capturing screenshot"
  chrome.tabs.captureVisibleTab(null, {'format': 'png'}, (screenshotData) ->
    #console.log screenshotData
    console.log "cropping screenshot"
    cropBase64Image(screenshotData, screenshotCoordinates, (croppedImage) ->
      console.log "printing result of crop"
      console.log croppedImage
      sendMessage({'screenshotResult': croppedImage})
    )
    chrome.tabs.executeScript(null, {'file': 'setNoteBodyBackToNormal.js'})
  )

cropBase64Image = (imgData, screenshotCoordinates, callback) ->
  canvas = document.createElement('canvas')
  canvas.width = screenshotCoordinates.width
  canvas.height = screenshotCoordinates.height
  context = canvas.getContext('2d')
  imageObj = new Image()
  imageObj.width = screenshotCoordinates.width
  imageObj.heigth = screenshotCoordinates.height
  imageObj.onload = () ->
    context.drawImage(
      imageObj,
      screenshotCoordinates.left,
      screenshotCoordinates.top,
      screenshotCoordinates.width,
      screenshotCoordinates.height,
      0,
      0,
      screenshotCoordinates.width,
      screenshotCoordinates.height
    )
    callback(context.canvas.toDataURL("image/png"))
  imageObj.src = imgData

sendMessage = (message) ->
  console.log 'sending message:'
  console.log message
  chrome.tabs.getSelected(null, (tab) ->
    chrome.tabs.sendMessage(tab.id, message)
  )

document.addEventListener('DOMContentLoaded', () ->
  console.log 'content loaded!'
  $('#lang_zh').click(() ->
    sendMessage({'selectedLanguage': 'zh'})
  )
  $('#lang_ja').click(() ->
    sendMessage({'selectedLanguage': 'ja'})
  )
  $('#lang_de').click(() ->
    sendMessage({'selectedLanguage': 'de'})
  )
  $('#lang_fr').click(() ->
    sendMessage({'selectedLanguage': 'fr'})
  )
  $('#disable_popup').click(() ->
    sendMessage({'closePopup': 'true'})
  )
  setInterval(() ->
    sendMessage({'log': 'are we still running?'})
  , 1000)
  #now.ready(() ->
  #  #doOncePageLoads()
  #chrome.tabs.executeScript(null, {'file': 'browserexec.js'})
  #  #chrome.tabs.executeScript(null, {'file': 'setNoteBodyWhite.js'})
  #)
)

###
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
###
