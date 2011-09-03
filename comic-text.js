// performance timer
var start = (new Date).getTime();

// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds
var _offsetX = 10; // pixels from mouse
var _offsetY = 22; // pixels from mouse

// member vars
var _mouseX;
var _mouseY;

var _$popup;
var _elementInfos = [];
var _currentElement;

// load the options from the back-end
chrome.extension.sendRequest({ method: "getOptions" }, function (opts) {

	function isWhitelisted(url) {
		var regexs = util.getWhitelistRegexs(opts.whitelist);
		for (var i = 0; i < regexs.length; i++) {
			if (regexs[i].test(url)) {
				return true;
			}
		}
		return false;
	}

	function getTagSelector() {
		var selector = opts.tags;
		if (selector === "all") {
			selector = "*"
		}
		return selector;
	}

	function getPosition() {
		var top = _mouseY + _offsetY;
		var left = _mouseX + _offsetX;

		// reposition the popup if it runs up against the edge of the screen
		if (left + _$popup.outerWidth() > $(window).width()) {
			left -= (left + _$popup.outerWidth()) - $(window).width();
		}
		if (top + _$popup.outerHeight() > $(window).height()) {
			top -= (top + _$popup.outerHeight()) - $(window).height();
		}

		return { top: top,
			left: left
		};
	}

	function showPopup(info) {

		var text = util.prepareText(info.title);
		_$popup.html(text);
		_$popup.hide();

		util.log("starting countdown to show : " + info.title);
		setTimeout(function () {
			if (info.isMouseOver) {

				// show the popup
				util.log("showing popup: " + info.title);
				var position = getPosition();
				_$popup.css({
					"top": position.top + "px",
					"left": position.left + "px"
				});

				_$popup.fadeIn(_fadeDuration);
			}
		}, _mouseoverDelay);
	}

	function injectPopup() {

		// inject our CSS into the page
		$("<style/>")
			.attr("type", "text/css")
			.html(opts.css)
			.appendTo($("body"));

		// inject the one-and-only popup
		_$popup = $("<div/>")
						.addClass("comic-text-popup")
						.css({
							"position": "fixed",
							"display": "none",
							"z-index": "99999999"
						})
						.appendTo("body");
						
						
		// dismiss the popup on right click
		var cancelNext = false;
		_$popup.mousedown(function(e) {
			
			util.log("popup was clicked, button #: " + e.which);
			
			if (e.which != 3) { // right click only
				return;
			}
			
			// hide it
			if (_$popup.is(":visible")) {
				_$popup.hide();
			}
			
			// set the flag to cancel the next context menu
			cancelNext = true;
		});
		
		// cancel the context menu if the popup was just dismissed
		$(document).bind("contextmenu",function(e){
			if (cancelNext) {
				cancelNext = false;
				return false;
			}
		});
	}

	function onMouseLeave(e) {

		// if we moused into the popup, rebind the mouseleave handler to the popup
		if (e.relatedTarget === _$popup[0]) {
			util.log("rebinding mouseleave to popup");
			_$popup.one("mouseleave", { elementInfo: e.data.elementInfo }, onMouseLeave);
			return;
		}

		// if we moused from the popup into the current element, rebind to the element
		if (e.relatedTarget === _currentElement) {
			util.log("rebinding mouseleave to original element");
			$(_currentElement).one("mouseleave", { elementInfo: e.data.elementInfo }, onMouseLeave);
			return;
		}

		// mark the element as not having the mouse over it
		var elementInfo = e.data.elementInfo;
		util.log("marking as !isMouseOver: " + elementInfo.title);
		elementInfo.isMouseOver = false;

		// remove this item from the stack
		var info = _elementInfos.pop();

		// restore the element's original title
		info.element.title = info.title;
		printStack("popped", info);
	}

	function printStack(operation, info) {
		var s = info ? info.title : info;
		util.log(operation + " an element titled '" + s + "' -- stack size: " + _elementInfos.length);
		util.log("stack: " + _elementInfos.map(function (o) { return o.title; }).join(", "));
	}

	function processElement(element, addCallback) {

		util.log("processing element: " + element.title);

		// push an entry onto the stack
		var info = new model.ElementInfo(element, element.title, true);
		addCallback(info);

		// suppress the built-in tooltip
		element.title = "";

		// handle mouseouts so we can know if the mouse leaves 
		// the element before the popup ever appears
		$(element).one("mouseleave", { elementInfo: info }, onMouseLeave);
	}

	// keep track of where the mouse is and show popups as needed
	function onMouseMove(e) {

		_mouseX = e.clientX;
		_mouseY = e.clientY;


		// don't continue unless we're on a new element
		if (_currentElement === e.target) {
			return;
		}

		// the tooltip itself doesn't count
		if (e.target === _$popup[0]) {
			return;
		}

		// we're on a new element
		_currentElement = e.target;
		util.log("------- new element --------");

		// so hide the popup
		if (_$popup.is(":visible")) {
			_$popup.hide();
		}

		// if we weren't previously over the current element, it'll
		// have a title, so let's process it
		if (_currentElement.title && $(_currentElement).is(getTagSelector())) {

			// handle the current element
			processElement(_currentElement, function (info) {
				_elementInfos.push(info);
				printStack("pushed", info);
			});

			// we need to suppress tooltips for any parent elements, too
			$(_currentElement).parents().each(function () {
				if (this.title) {
					processElement(this, function (info) {
						_elementInfos.splice(0, 0, info);
						printStack("spliced", info);
					});
				}
			});
		}

		// show the popup. info is at the top of the stack
		if (_elementInfos.length > 0) {
			showPopup(_elementInfos[_elementInfos.length - 1]);
		}
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {

		util.log("current site is on the list!");

		// inject our css & dom element into the page
		injectPopup();

		// show tooltips by tracking mouse movement and acting accordingly
		$(document).mousemove(onMouseMove);

		var elapsed = (new Date).getTime() - start;
		util.log("total initialization time: " + elapsed + " milliseconds");
	}
});