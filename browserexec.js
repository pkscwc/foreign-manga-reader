var selection=window.getSelection().toString().trim();
if (selection && selection.length > 0) {
  chrome.extension.sendMessage({"selectedText": selection})
} else {
  //selection = document.getElementsByClassName('note-body')[0].innerHTML
  selection = $('.note-body').html()
  //selection = '我喜欢吃热狗'
	chrome.extension.sendMessage({"selectedHTML": selection})
}

