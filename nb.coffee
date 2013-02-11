root = exports ? this

root.currentText = ''

callOnceElementAvailable = (element, callback) ->
  if $(element).length > 0
    callback()
  else
    setTimeout(() ->
      callOnceElementAvailable(element, callback)
    , 300)

$(document).ready(
  popupSentenceDisplay = $('''<div id="popupSentenceDisplay">dialog content is here</div>''')
  popupSentenceDisplay.dialog({
    'autoOpen': false,
    'modal': false,
    'title': '',
    #'show': 'clip',
    #'hide': 'clip',
    'position': ['right', 'top'],
    'zIndex': 99,
    'width': '100%',
    'maxHeight': '500px',
    'create': () ->
      $(this).css("maxHeight", 500);        
  }).css('max-height', '500px')
  callOnceElementAvailable('.location-shortbody-text', () ->
    for lang in ['zh', 'ja']
      console.log lang
      console.log $('.location-shortbody-text').text()
      if $('.location-shortbody-text').text().indexOf('lang=' + lang) != -1
        root.selectedLanguage = lang
        break
  )
)

root.selectedLanguage = 'zh'

chrome.extension.onMessage.addListener((request, sender, sendResponse) ->
  if request['selectedLanguage']?
    root.selectedLanguage = request['selectedLanguage']
  console.log request
)

haveNewText = () ->
  console.log root.currentText
  $('#popupSentenceDisplay').dialog('open')
  $('#popupSentenceDisplay').text('')
  $('.ui-dialog').css('z-index', 99)
  $('#popupSentenceDisplay').css('max-height', '500px')
  root.addSentence(root.currentText, root.selectedLanguage, $('#popupSentenceDisplay'))

setInterval(() ->
  selectedText = $('.note-body').text()
  if selectedText.indexOf('http://geza') != -1
    selectedText = selectedText[...selectedText.indexOf('http://geza')]
  parenIndexes = (selectedText.indexOf(x) for x in ')）' when selectedText.indexOf(x) != -1)
  if parenIndexes.length > 0
    parenIndex = Math.min.apply(Math, parenIndexes)
    lineNum = selectedText[...parenIndex].trim()
    if not isNaN(lineNum)
      selectedText = selectedText[parenIndex+1..]
  if selectedText != root.currentText
    root.currentText = selectedText
    haveNewText()
, 300)

