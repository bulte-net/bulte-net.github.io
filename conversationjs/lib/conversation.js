(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("conversationJS", [], factory);
	else if(typeof exports === 'object')
		exports["conversationJS"] = factory();
	else
		root["conversationJS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _html = __webpack_require__(1);
	
	var _html2 = _interopRequireDefault(_html);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Conversation = function () {
	  function Conversation(configSelector, playerSelector) {
	    var _this = this;
	
	    var typeDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [50, 100];
	    var animationClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'fadeInDown';
	
	    _classCallCheck(this, Conversation);
	
	    this.animationClass = animationClass;
	    this.typeDelay = typeDelay;
	    this.config = document.querySelector(configSelector);
	    this.player = document.querySelector(playerSelector);
	
	    // extract the main data structure
	    this.blocks = [].concat(_toConsumableArray(this.config.querySelectorAll('[step="0"]'))).map(function (block) {
	      return {
	        id: block.attributes.block.value,
	        title: block.innerHTML,
	        played: false,
	        sentences: _this.config.querySelectorAll('[block="' + block.attributes.block.value + '"]:not([step="0"])')
	      };
	    });
	  }
	
	  _createClass(Conversation, [{
	    key: '_addClasses',
	    value: function _addClasses(element, classes) {
	      classes.forEach(function (cssClass) {
	        element.classList.add(cssClass);
	      });
	    }
	  }, {
	    key: '_answer',
	    value: function _answer(block) {
	      this.questions.remove();
	      var answer = document.createElement('div');
	      this._addClasses(answer, ['questions', 'answered']);
	      var inner = document.createElement('span');
	      inner.innerHTML = block.title;
	      answer.appendChild(inner);
	      this.player.appendChild(answer);
	      this._addClasses(answer, ['animated', 'fadeInLeft']);
	      this._playBlock(block);
	    }
	  }, {
	    key: '_showQuestions',
	    value: function _showQuestions(blocks) {
	      var _this2 = this;
	
	      if (blocks.length === 0) return;
	      this.questions = document.createElement('div');
	      this.questions.classList.add('questions');
	      var questionsInner = document.createElement('div');
	      this.questions.appendChild(questionsInner);
	      blocks.forEach(function (block) {
	        var button = document.createElement('button');
	        button.innerHTML = block.title;
	        button.onclick = function () {
	          _this2._answer(block);
	        };
	        questionsInner.appendChild(button);
	      });
	      this.player.appendChild(this.questions);
	      this.questions.scrollIntoView({ behavior: 'smooth' });
	      this._addClasses(this.questions, ['animated', 'fadeInUp']);
	    }
	  }, {
	    key: '_getTypeDelay',
	    value: function _getTypeDelay() {
	      return Math.random() * (this.typeDelay[1] - this.typeDelay[0]) + this.typeDelay[0];
	    }
	  }, {
	    key: '_playLetter',
	    value: function _playLetter(letters, sentence, htmlMap, doneCallback) {
	      var _this3 = this;
	
	      if (letters.length === 0) {
	        return doneCallback();
	      }
	      var text = _html2.default.strip(sentence.innerHTML) + letters.shift();
	      sentence.innerHTML = _html2.default.inject(text, htmlMap);
	      // schedule the next letter after type delay
	      setTimeout(function () {
	        _this3._playLetter(letters, sentence, htmlMap, doneCallback);
	      }, this._getTypeDelay());
	    }
	  }, {
	    key: '_playSentence',
	    value: function _playSentence(sentences, doneCallback) {
	      var _this4 = this;
	
	      if (sentences.length === 0) {
	        return doneCallback();
	      }
	      var sentence = sentences.shift();
	      // inject a span to allow flexbox centering
	      var text = '<span>' + sentence.innerHTML + '</span>';
	      var htmlMap = _html2.default.map(text);
	      var letters = [].concat(_toConsumableArray(_html2.default.strip(text)));
	      sentence.innerHTML = '';
	      this._playLetter(letters, sentence, htmlMap, function () {
	        // this sentence has finished playing, queue the next
	        sentence.classList.remove('is-typing');
	        _this4._playSentence(sentences, doneCallback);
	      });
	      sentence.classList.add('is-typing');
	      this.player.appendChild(sentence);
	      sentence.scrollIntoView({ behavior: 'smooth' });
	      // flipInX
	      this._addClasses(sentence, ['animated', this.animationClass]);
	    }
	  }, {
	    key: '_playBlock',
	    value: function _playBlock(block) {
	      var _this5 = this;
	
	      block.played = true;
	      this._playSentence([].concat(_toConsumableArray(block.sentences)), function () {
	        _this5._showQuestions(_this5.blocks.filter(function (block) {
	          return !block.played;
	        }));
	      });
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      this._playBlock(this.blocks.find(function (block) {
	        return block.id === 'start';
	      }));
	    }
	  }]);
	
	  return Conversation;
	}();
	
	exports.default = Conversation;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];
	
	function isVoidElement(tag) {
	  var tagName = tag.match(/<([^\s>]+)/);
	  return Boolean(tagName) && voidElements.indexOf(tagName[1].toLowerCase()) > -1;
	}
	
	exports.default = {
	  strip: function strip(str) {
	    return str.replace(/(<([^>]+)>)/gi, '');
	  },
	  map: function map(str) {
	    var regexp = /<[^>]+>/gi;
	    var tags = [];
	    var openers = [];
	    var result = void 0;
	    var tag = void 0;
	
	    while (result = regexp.exec(str)) {
	      tag = {
	        tagName: result[0],
	        position: result.index
	      };
	
	      if (tag.tagName.charAt(1) === '/') {
	        tag.opener = openers.pop();
	      } else if (tag.tagName.charAt(tag.tagName.length - 2) !== '/' && !isVoidElement(tag.tagName)) {
	        openers.push(tag);
	      }
	
	      tags.push(tag);
	    }
	
	    return tags;
	  },
	  inject: function inject(str, map) {
	    for (var i = 0, tag; i < map.length; i++) {
	      tag = map[i];
	
	      if (str.length > 0 && tag.position <= str.length) {
	        str = str.substr(0, tag.position) + tag.tagName + str.substr(tag.position);
	      } else if (tag.opener && tag.opener.position < str.length) {
	        str += tag.tagName;
	      }
	    }
	
	    return str;
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=conversation.js.map