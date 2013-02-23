root = exports ? this

callOnceElementAvailable = root.callOnceElementAvailable = (element, callback) ->
  if $(element).length > 0
    callback()
  else
    setTimeout(() ->
      callOnceElementAvailable(element, callback)
    , 300)

callOnceObjectAvailable = root.callOnceObjectAvailable = (objectname, callback) ->
  if window[objectname]?
    callback()
  else
    setTimeout(() ->
      callOnceObjectAvailable(objectname, callback)
    , 300)

executeInPage = root.executeInPage = (myCode) ->
  #console.log $('<script>').text('(' + myCode + ')();')
  #$('head').append $('<script>').text('(' + myCode + ')();')
  scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.innerHTML = '(' + myCode + ')();'
  document.documentElement.appendChild(scriptTag)

assignVariable = root.assignVariable = (variableName, codeValue) ->
  codeValueAsText = codeValue.toString()
  scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.innerHTML = variableName + ' = ' + codeValueAsText + ';'
  document.documentElement.appendChild(scriptTag)

