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

var _elementsProcessedCount = 0;
var _elementsWithTitleCount = 0;
var _uniqueElementsCount = 0;

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

	function processDocument() {

		var start = (new Date).getTime();
		$(getTagSelector()).each(function (index, element) {
			processElement(element);
		});
		var elapsed = (new Date).getTime() - start;
		util.log("processed " + _elementsProcessedCount + " elements (" + _elementsWithTitleCount + " with a title attribute) in " + elapsed + " milliseconds");
	}

	function hidePopup() {
		util.log("hiding popup...");

		var elementInfo = _elementInfos.pop();
		if (elementInfo) {
			$(elementInfo.element).data("isActive", false);

			// restore the original title
			elementInfo.element.title = elementInfo.title;

			var s = elementInfo ? elementInfo.title : elementInfo;
			util.log("popped an element titled '" + s + "' -- stack size: " + _elementInfos.length);
			util.log("stack: " + _elementInfos.map(function (o) { return o.title; }).join(", "));

			_$popup.hide();
		}
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

	function showNextPopup() {

		// if we just moused back to a parent container that also has a title, show the parent's popup
		if (_elementInfos.length > 0) {

			util.log("there's another popup to show");
			var info = _elementInfos[_elementInfos.length - 1];

			var text = util.prepareText(info.title);
			_$popup.html(text);
			_$popup.hide();

			setTimeout(function () {
				if (info.isMouseOver) {

					// show the popup
					util.log("showing next popup...");
					var position = getPosition();
					_$popup.css({
						"top": position.top + "px",
						"left": position.left + "px"
					});

					_$popup.fadeIn(_fadeDuration);
				}
			}, _mouseoverDelay);
		}
	}

	function processElement(element) {

		_elementsProcessedCount++;

		if (!element.title) {
			return;
		}

		var $element = $(element);
		if (!$element.data("processed")) {
			!$element.data("processed", true);
			_uniqueElementsCount++;
		}

		_elementsWithTitleCount++;

		util.log("processing element with title: " + element.title + " -- count: " + _elementsWithTitleCount);

		// handle mouseovers on the element itself
		var elementInfo = new model.ElementInfo(element, element.title, false);

		$element.bind("mouseenter", function (e) {
			util.log("mouseenter");

			elementInfo.isMouseOver = true;

			// no need to continue if the mouse just exited the popup and went back to the current element
			if (e.relatedTarget === _$popup.get(0) &&
				_elementInfos[_elementInfos.length - 1] &&
				e.currentTarget === _elementInfos[_elementInfos.length - 1].element) {

				util.log("no need to continue if the mouse just exited the popup and went back to the current element");
				return;
			}

			if ($element.data("isActive")) {
				util.log("no need to continue since the element is already on the stack");
				return;
			}

			// save the element's original info for future reference
			if (e.relatedTarget === _$popup.get(0)) {
				// detect the case where we just left the popup after clearing the stack,
				// since the mouseenter events will fire in the reverse order from what we want.
				_elementInfos.splice(0, 0, elementInfo);
			}
			else {
				_elementInfos.push(elementInfo);
			}
			$element.data("isActive", true);
			var s = elementInfo ? elementInfo.title : elementInfo;
			util.log("pushed new element titled '" + s + "' -- stack size: " + _elementInfos.length);
			util.log("stack: " + _elementInfos.map(function (o) { return o.title; }).join(", "));

			// remove the title to suppress the built-in tooltip
			element.title = "";

			showNextPopup();
		});

		$element.bind("mouseleave", function (e) {

			util.log("mouseleave");
			elementInfo.isMouseOver = false;

			// don't hide the popup if the mouse just entered the popup					
			if (e.relatedTarget !== _$popup.get(0)) {
				hidePopup();
				showNextPopup();
			}
		});
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

		// handle mouseouts on the popup
		_$popup.mouseout(function (e) {

			util.log("mouseout of popup");

			// don't hide the popup if the mouse just entered the current element
			if (e.relatedTarget === _elementInfos[_elementInfos.length - 1].element) {
				return;
			}

			// clear the stack and let it rebuild as mouseenter events fire
			util.log("clearing the stack");
			while (_elementInfos.length > 0) {
				hidePopup();
			}

			showNextPopup();
		});
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {

		var start = (new Date).getTime();

		util.log("current site is on the list!");

		// inject our css & dom element into the page
		injectPopup();

		// track the user's current mouse position
		$(document).mousemove(function (e) {
			_mouseX = e.clientX;
			_mouseY = e.clientY;
		});

		// handle dynamic DOM insertions
		$(document).bind("DOMNodeInserted", function (event) {
			$(getTagSelector(), event.target).each(function (index, element) {
				processElement(element);
			});

			util.log("elements with title processed: " + _elementsWithTitleCount + " -- unqiue elements: " + _uniqueElementsCount);
		});

		// process the original document
		processDocument();
		util.log("elements with title processed: " + _elementsWithTitleCount + " -- unqiue elements: " + _uniqueElementsCount);

		var elapsed = (new Date).getTime() - start;
		util.log("total initialization time: " + elapsed + " milliseconds");
	}
});