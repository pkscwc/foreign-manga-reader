// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var addIdsToHierarchy, addSentence, addSentences, callOnceElementAvailable, getChildrenOfId, getMaxDepth, getUrlParameters, hierarchyToTerminals, hierarchyWithIdToTerminals, initializeHover, initializePopup, makeDivs, openTranslationPopup, renderSentence, root, submitTranslation, synthesizeSpeech, updateTranslation;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  (function($) {
    var depthToColor;
    depthToColor = function(depth) {
      var colors, i;
      colors = '00000000000012345678ABCDEF';
      return '#' + ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 5; i = ++_i) {
          _results.push(colors[colors.length - depth - 1]);
        }
        return _results;
      })()).join('');
    };
    $.fn.borderStuff = function(depth, maxdepth, color) {
      var fontSize, lang, margin, padding, width;
      width = 3;
      /*
          depth = $(this).parents().attr('depth')
          console.log this.parent()
          if depth?
            depth = parseInt(depth) + 1
          else
            depth = 0
      */

      padding = 8;
      fontSize = 18;
      lang = this.attr('foreignLang');
      if (lang === 'zh' || lang === 'ja') fontSize = 32;
      margin = 0;
      if (color === 'white') {
        margin = (maxdepth - depth + 1) * padding + (maxdepth - depth);
      }
      if (!(color != null)) color = depthToColor(depth);
      this.addClass('bordered').css('position', 'relative').css('padding', padding + 'px').css('font-size', fontSize).attr('color', color).css('background-color', color).css('border-width', 1).css('border-style', 'solid').css('float', 'left').attr('depth', depth).css('border-color', 'black').css('border-radius', '10px').css('margin-top', margin).css('margin-bottom', margin);
      if (this.attr('id').indexOf('_') === -1) {
        this.css('margin-top', $('#H' + this.attr('id')).height());
      }
      return this;
    };
    $.fn.showAsSibling = function(color) {
      var setWidth, siblingToShow,
        _this = this;
      if (color != null) this.css('background-color', color);
      siblingToShow = $('#H' + this.attr('id'));
      siblingToShow.show();
      this.addClass('hovered');
      setWidth = function() {
        var left, ownHalfWidth, siblingHalfWidth, top;
        ownHalfWidth = _this.width() / 2;
        siblingHalfWidth = siblingToShow.width() / 2;
        left = Math.max(0, ownHalfWidth - siblingHalfWidth);
        top = -siblingToShow.height();
        siblingToShow.css('left', left);
        return siblingToShow.css('top', top);
      };
      setWidth();
      siblingToShow.mouseover(function() {
        return false;
      });
      return this;
    };
    return $.fn.hoverId = function() {
      var idNum, shortTranslation, shortTranslationDiv, text, textAsHtml, x, _i, _len, _ref,
        _this = this;
      text = this.attr('translation');
      if (text.indexOf('/EntL') !== -1) {
        text = text.slice(0, text.indexOf('/EntL'));
      }
      idNum = this.attr('id');
      this.attr('title', text);
      this.attr('hovertext', text);
      textAsHtml = $('<div>');
      _ref = text.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        textAsHtml.append($('<span>').text(x)).append('<br>');
      }
      this.tooltip({
        track: true,
        show: false,
        hide: false,
        content: textAsHtml.html()
      });
      shortTranslation = text;
      if (shortTranslation.indexOf('\n') !== -1) {
        shortTranslation = shortTranslation.slice(0, shortTranslation.indexOf('\n'));
      }
      shortTranslationDiv = $('<div>').addClass('Hovertips').attr('id', 'H' + idNum).text(shortTranslation).css('position', 'absolute').css('top', 0).css('zIndex', 100).css('color', 'white').css('background-color', 'black').css('border-top-left-radius', 5).css('border-top-right-radius', 5).css('font-size', 18).hide();
      shortTranslationDiv.css('text-align', 'center').css('word-wrap', 'break-word');
      this.append(shortTranslationDiv);
      this.mouseover(function() {
        var currentId, immediateChild, parent, sibling, siblings, _j, _k, _l, _len1, _len2, _len3, _ref1, _ref2;
        console.log(_this.attr('foreigntext'));
        synthesizeSpeech(_this.attr('foreigntext'), _this.attr('foreignlang'));
        _this.css('background-color', 'yellow');
        _ref1 = $('.bordered');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          $(x).css('background-color', $(x).attr('color'));
        }
        _this.addClass('hovered');
        currentId = idNum;
        $('.Hovertips').hide();
        while (currentId.indexOf('_') !== -1) {
          parent = currentId.split('_').slice(0, -1).join('_');
          siblings = (function() {
            var _k, _len2, _ref2, _results;
            _ref2 = getChildrenOfId(parent);
            _results = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              x = _ref2[_k];
              if (x !== currentId) _results.push(x);
            }
            return _results;
          })();
          for (_k = 0, _len2 = siblings.length; _k < _len2; _k++) {
            sibling = siblings[_k];
            $('#' + sibling).showAsSibling('lightblue');
          }
          currentId = parent;
        }
        if (getChildrenOfId(idNum).length === 0) {
          _this.showAsSibling('yellow');
        } else {
          _ref2 = getChildrenOfId(idNum);
          for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
            immediateChild = _ref2[_l];
            $('#' + immediateChild).showAsSibling('pink');
          }
        }
        _this.css('background-color', 'yellow');
        return false;
      });
      this.mouseleave(function() {
        var myId, rootId, _j, _len1, _ref1;
        _ref1 = $('.hovered');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          $(x).css('background-color', $(x).attr('color'));
        }
        $('.hovered').removeClass('hovered');
        $('.Hovertips').hide();
        myId = _this.attr('id');
        rootId = myId;
        if (myId.indexOf('_') !== -1) rootId = myId.slice(0, myId.indexOf('_'));
        console.log(rootId);
        _this.css('background-color', _this.attr('color'));
        return $('#' + rootId).showAsSibling();
      });
      return this;
    };
  })($);

  synthesizeSpeech = root.synthesizeSpeech = function(sentence, lang) {
    var audioTag;
    audioTag = $('audio')[0];
    if (!audioTag) {
      $('body').append($('<audio>'));
      audioTag = $('audio')[0];
    }
    audioTag.src = 'http://geza.csail.mit.edu:1357/synthesize?sentence=' + sentence + '&lang=' + lang;
    return audioTag.play();
  };

  'ref_hierarchy = [[\'私\', \'の\', \'猫\'], \'が\', [[\'家\', \'で\'], [ [[\'五\', \'匹\'], \'の\', \'鼠\'], \'を\', \'食べた\']]]\ntranslations = {\n\'私の猫が家で五匹の鼠を食べた\': \'my cat ate 5 mice in the house\',\n\'私の猫\': \'my cat\',\n\'私\': \'me\',\n\'の\': \'of\',\n\'猫\': \'cat\',\n\'が\': \'subject marker\',\n\'家で五匹の鼠を食べた\': \'ate 5 mice in the house\',\n\'家で\': \'in the house\',\n\'家\': \'house\',\n\'で\': \'in\',\n\'五匹の鼠を食べた\': \'ate 5 mice\',\n\'五匹の鼠\': \'5 mice\',\n\'五匹\': \'5 small animals\',\n\'五\': \'5\',\n\'匹\': \'counter for small animals\',\n\'鼠\': \'mouse\',\n\'を\': \'object marker\',\n\'食べた\': \'ate\',\n}';


  'getMaxDepth = root.getMaxDepth = (id) ->\n  maxval = 0\n  for child in getChildrenOfId(id)\n    maxval = Math.max(maxval, getMaxDepth(child)+1)\n  return maxval';


  getMaxDepth = root.getMaxDepth = function(subtree) {
    var child, maxval, _i, _len;
    if (typeof subtree !== typeof []) return 0;
    maxval = 0;
    for (_i = 0, _len = subtree.length; _i < _len; _i++) {
      child = subtree[_i];
      maxval = Math.max(maxval, getMaxDepth(child) + 1);
    }
    return maxval;
  };

  'getMaxDepth = root.getMaxDepth = (id) ->\n  if not id?\n    id = \'R\'\n  maxval = 0\n  for childId in getChildrenOfId(id)\n    maxval = Math.max(maxval, getMaxDepth(childId) + 1)\n  return maxval';


  getChildrenOfId = root.getChildrenOfId = function(id) {
    var x;
    return (function() {
      var _i, _len, _ref, _results;
      _ref = $('#' + id).children('.textRegion');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push($(x).attr('id'));
      }
      return _results;
    })();
  };

  hierarchyToTerminals = function(hierarchy, lang) {
    var children, x;
    if (typeof hierarchy === typeof []) {
      children = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = hierarchy.length; _i < _len; _i++) {
          x = hierarchy[_i];
          _results.push(hierarchyToTerminals(x, lang));
        }
        return _results;
      })();
      if (!(lang != null) || lang === 'zh' || lang === 'ja') {
        return children.join('');
      } else {
        return children.join(' ');
      }
    } else {
      return hierarchy;
    }
  };

  hierarchyWithIdToTerminals = function(hierarchy, lang) {
    var children, contents, id, x;
    if (typeof hierarchy === typeof '') return hierarchy;
    id = hierarchy.id;
    contents = hierarchy.slice(0);
    if (contents.length === 1) {
      return hierarchyWithIdToTerminals(contents[0]);
    } else {

    }
    if (true) {
      children = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = contents.length; _i < _len; _i++) {
          x = contents[_i];
          _results.push(hierarchyWithIdToTerminals(x, lang));
        }
        return _results;
      })();
      if (!(lang != null) || lang === 'zh' || lang === 'ja') {
        return children.join('');
      } else {
        return children.join(' ');
      }
    }
  };

  initializeHover = function(basediv) {
    var contentHierarchy, depth, maxdepth;
    contentHierarchy = JSON.parse(basediv.attr('contentHierarchy'));
    depth = basediv.attr('depth');
    maxdepth = basediv.attr('maxdepth');
    basediv.hoverId();
    if (contentHierarchy.length > 1) {
      return basediv.borderStuff(depth, maxdepth);
    } else if (contentHierarchy.length === 1) {
      if (typeof contentHierarchy[0] === typeof '') {
        return basediv.borderStuff(depth, maxdepth, 'white').text(contentHierarchy[0]).hoverId();
      } else {
        return basediv.borderStuff(depth, maxdepth, 'white').text(contentHierarchy[0]).hoverId();
      }
    }
  };

  makeDivs = function(subHierarchy, lang, translations, maxdepth, depth) {
    var basediv, child, contentHierarchy, foreignText, id, translation, _i, _len;
    if (depth == null) depth = 1;
    basediv = $('<div>');
    id = subHierarchy.id;
    contentHierarchy = subHierarchy.slice(0);
    basediv.addClass('hovertext').attr('id', id);
    basediv.addClass('hovertext').addClass('textRegion');
    foreignText = hierarchyWithIdToTerminals(subHierarchy, lang);
    basediv.attr('foreignText', foreignText);
    basediv.attr('foreignLang', lang);
    translation = translations[foreignText];
    basediv.attr('translation', translation);
    basediv.attr('depth', depth);
    basediv.attr('maxdepth', maxdepth);
    basediv.attr('contentHierarchy', JSON.stringify(contentHierarchy));
    basediv.hoverId();
    (function(id) {
      return basediv.click(function() {
        var lForeignText, lTranslation, shortTranslation;
        lForeignText = $('#' + id).attr('foreignText');
        lTranslation = $('#' + id).attr('translation');
        console.log('clicked:');
        console.log(lForeignText);
        console.log('translation:');
        shortTranslation = lTranslation;
        if (shortTranslation.indexOf('\n') !== -1) {
          shortTranslation = shortTranslation.split('\n')[0];
        }
        console.log(shortTranslation);
        openTranslationPopup(foreignText, shortTranslation, lang, id);
        return false;
      });
    })(id);
    initializeHover(basediv);
    if (contentHierarchy.length > 1) {
      basediv.borderStuff(depth, maxdepth);
      for (_i = 0, _len = contentHierarchy.length; _i < _len; _i++) {
        child = contentHierarchy[_i];
        basediv.append(makeDivs(child, lang, translations, maxdepth, depth + 1));
      }
    } else if (contentHierarchy.length === 1) {
      if (typeof contentHierarchy[0] === typeof '') {
        basediv.borderStuff(depth, maxdepth, 'white').text(contentHierarchy[0]).hoverId();
      } else {
        basediv.borderStuff(depth, maxdepth, 'white').text(contentHierarchy[0]).hoverId();
      }
    }
    return basediv;
  };

  addIdsToHierarchy = function(hierarchy, myId) {
    var i, output, x, _i, _len;
    if (myId == null) myId = 'R0';
    if (typeof hierarchy === typeof []) {
      output = [];
      for (i = _i = 0, _len = hierarchy.length; _i < _len; i = ++_i) {
        x = hierarchy[i];
        console.log(x);
        output.push(addIdsToHierarchy(x, myId + '_' + i));
      }
      output.id = myId;
      return output;
    } else {
      output = [hierarchy];
      output.id = myId;
      return output;
    }
  };

  getUrlParameters = root.getUrlParameters = function() {
    var map, parts;
    map = {};
    parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      return map[key] = decodeURI(value);
    });
    return map;
  };

  callOnceElementAvailable = function(element, callback) {
    if ($(element).length > 0) {
      return callback();
    } else {
      return setTimeout(function() {
        return callOnceElementAvailable(element, callback);
      }, 10);
    }
  };

  renderSentence = function(sentence, ref_hierarchy, translations, lang, renderTarget) {
    var idnum, ref_hierarchy_with_ids, rootBaseDiv;
    console.log(ref_hierarchy);
    console.log(translations);
    idnum = 0;
    while ($('#R' + idnum).length > 0) {
      idnum += 1;
    }
    ref_hierarchy_with_ids = addIdsToHierarchy(ref_hierarchy, 'R' + idnum);
    console.log(ref_hierarchy_with_ids);
    rootBaseDiv = makeDivs(ref_hierarchy_with_ids, lang, translations, getMaxDepth(ref_hierarchy_with_ids) - 1);
    renderTarget.append(rootBaseDiv).append('<br>');
    rootBaseDiv.showAsSibling();
    return callOnceElementAvailable('#HR' + idnum, function() {
      var currentTopMargin;
      currentTopMargin = 0;
      return rootBaseDiv.css('margin-top', currentTopMargin + $('#HR' + idnum).height());
    }, 10);
  };

  addSentence = root.addSentence = function(sentence, lang, renderTarget, clearExisting) {
    if (clearExisting == null) clearExisting = false;
    return addSentences([sentence], lang, renderTarget, clearExisting);
  };

  if (!(root.serverLocation != null)) root.serverLocation = '';

  submitTranslation = root.submitTranslation = function(origPhrase, translation, lang) {
    var reqParams;
    console.log('translation submitted');
    console.log(origPhrase);
    console.log(translation);
    reqParams = {
      'sentence': origPhrase,
      'lang': lang,
      'targetlang': 'en',
      'translation': translation
    };
    console.log(root.serverLocation + '/submitTranslation?' + $.param(reqParams));
    return $.get(root.serverLocation + '/submitTranslation?' + $.param(reqParams));
  };

  updateTranslation = function(id, translation) {
    var basediv, fullTranslation, parentId, parentdiv;
    console.log('updateTranslation for:' + id);
    basediv = $('#' + id);
    fullTranslation = basediv.attr('translation').split('\n');
    fullTranslation[0] = translation;
    basediv.attr('translation', fullTranslation.join('\n'));
    basediv.hoverId();
    $('#H' + id).text(translation);
    if (id.indexOf('_') !== -1) {
      parentId = id.split('_').slice(0, -1).join('_');
      return parentdiv = $('#' + parentId);
    } else {
      return basediv.css('margin-top', $('#H' + id).height());
    }
  };

  openTranslationPopup = root.openTranslationPopup = function(sentenceToTranslate, translation, lang, id) {
    initializePopup();
    $('#sentenceToTranslate').text(sentenceToTranslate);
    $('#translationInput').val(translation);
    $('#popupTranslateDisplay').attr('translationForId', id);
    $('#popupTranslateDisplay').attr('translationForLang', lang);
    return $('#popupTranslateDisplay').dialog('open');
  };

  root.popupInitialized = false;

  initializePopup = root.initializePopup = function() {
    var popupTranslateDisplay;
    if (root.popupInitialized) return;
    root.popupInitialized = true;
    popupTranslateDisplay = $('<div id="popupTranslateDisplay">Translation for <span id="sentenceToTranslate"></span><form action="javascript:void(0)" id="translationForm"><input type="text" id="translationInput" /><input type="hidden" value="submit" /></form></div>');
    return popupTranslateDisplay.dialog({
      'autoOpen': false,
      'modal': false,
      'title': '',
      'zIndex': 99,
      'create': function() {
        $(this).css("maxHeight", 500);
        return $('#translationInput').keypress(function(e) {
          var inputtedText, lang, origPhrase, translation;
          if (e.keyCode === 13) {
            inputtedText = $('#translationInput').val();
            $('#popupTranslateDisplay').dialog('close');
            if (inputtedText === '') {
              return false;
            } else {
              origPhrase = $('#sentenceToTranslate').text();
              translation = $('#translationInput').val();
              lang = $('#popupTranslateDisplay').attr('translationForLang');
              submitTranslation(origPhrase, translation, lang);
              updateTranslation($('#popupTranslateDisplay').attr('translationForId'), translation);
              return false;
            }
          }
        });
      }
    }).css('max-height', '500px');
  };

  addSentences = root.addSentences = function(sentences, lang, renderTarget, clearExisting) {
    var parseHierarchyAndTranslationsForLang, _ref;
    if (clearExisting == null) clearExisting = false;
    if (!(lang != null) && !(renderTarget != null)) {
      lang = (_ref = getUrlParameters()['lang']) != null ? _ref : 'en';
      renderTarget = $('#sentenceDisplay');
    }
    if (!(renderTarget != null)) renderTarget = $('#sentenceDisplay');
    parseHierarchyAndTranslationsForLang = function(sentence, callback) {
      return $.get(root.serverLocation + '/getParseHierarchyAndTranslations?sentence=' + encodeURI(sentence) + '&lang=' + encodeURI(lang), function(resultData, resultStatus) {
        var currentPair;
        resultData = JSON.parse(resultData);
        currentPair = [resultData.hierarchy, resultData.translations];
        return callback(null, currentPair);
      });
    };
    return async.mapSeries(sentences, parseHierarchyAndTranslationsForLang, function(err, results) {
      var i, ref_hierarchy, sentence, translations, _i, _ref1, _ref2, _results;
      if (clearExisting) renderTarget.html('');
      _results = [];
      for (i = _i = 0, _ref1 = results.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        sentence = sentences[i];
        _ref2 = results[i], ref_hierarchy = _ref2[0], translations = _ref2[1];
        _results.push(renderSentence(sentence, ref_hierarchy, translations, lang, renderTarget));
      }
      return _results;
    });
  };

  console.log('visutils loaded');

  root.addSentence = addSentence;

}).call(this);
