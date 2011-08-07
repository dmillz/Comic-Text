// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds
var _offsetX = 10; // pixels from mouse
var _offsetY = 22; // pixels from mouse

// member vars
var _mouseX;
var _mouseY;

var _$popup;
var _currentElements = [];
var _currentElementTitles = [];

var _elementsProcessedCount = 0;
var _elementsWithTitleCount = 0;

// load the options from the back-end
chrome.extension.sendRequest({method: "getOptions"}, function(opts) {
	
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
		$(getTagSelector()).each(function(index, element) {
			processElement(element);			
		});		
		var elapsed = (new Date).getTime() - start;
		util.log("processed " + _elementsProcessedCount + " elements (" + _elementsWithTitleCount + " with a title attribute) in " + elapsed + " milliseconds");
	}
	
	function hidePopup() {
		util.log("hiding popup...");
		
		//restore the original title
		var element = _currentElements.pop();
		var title = _currentElementTitles.pop();
		element.title = title;
		
		// hide the popup
		_$popup.hide();					
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
				 left: left };
	}
	
	function processElement(element) {
		
		_elementsProcessedCount++;
	
		if (!element.title) {
			return;
		}
		
		_elementsWithTitleCount++;
		
		util.log("processing element with title: " + element.title);
		
		// handle mouseovers on the element itself
		var isOverElement = false;
		$(element).hover(
			function(e) { // mouseover
				
				isOverElement = true;
				
				// no need to continue if the mouse just exited the popup and went back to the current element
				if (e.relatedTarget === _$popup.get(0) && e.currentTarget === _currentElements[_currentElements.length-1]) {
					util.log("no need to continue if the mouse just exited the popup and went back to the current element");
					return;
				}
				
				// save the element's original title for future reference
				_currentElements.push(element);
				_currentElementTitles.push(element.title);
					
				// remove the title to suppress the built-in tooltip
				element.title = "";
								
				// update the popup's text
				var text = util.prepareText(_currentElementTitles[_currentElementTitles.length-1]);
				_$popup.html(text);

				// delay the appearance of the popup just slightly, to mimic Chrome
				setTimeout(function() {
				
					// make sure we're still over the element, 
					if (!isOverElement) {
						return;
					}
					
					// show the popup
					util.log("showing popup...");
					var position = getPosition();
					_$popup.css({ 
								"top": position.top + "px",
								"left": position.left + "px",
								"position": "fixed"
								});
					_$popup.fadeIn(_fadeDuration);
					
				}, _mouseoverDelay);
			}, 
			function(e) { // mouseout
			
				isOverElement = false;
				
				// don't hide the popup if the mouse just entered the popup					
				if (e.relatedTarget !== _$popup.get(0)) {
					hidePopup();
					
					// if we just moused back to a parent container that also has a title, show the parent's popup
					if (_currentElements.length > 0) {
					
						// show the popup
						util.log("moused back to container, showing parent's popup...");
						var position = getPosition();
						_$popup.css({ 
									"top": position.top + "px",
									"left": position.left + "px"
									});
						var text = util.prepareText(_currentElementTitles[_currentElementTitles.length-1]);
						_$popup.html(text);
						_$popup.fadeIn(_fadeDuration);
					}
				}
			}			
		);
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
		_$popup.mouseout(function(e) { 	
			// don't hide the popup if the mouse just entered the current element
			if (e.relatedTarget !== _currentElements[_currentElements.length-1]) {
				hidePopup();																
			}
		});
	}
	
	// initialize everything
	if (isWhitelisted(window.location.host)) {
		
		var start = (new Date).getTime();
		
		util.log("current site is on the list!");
		
		// inject our css & dom element into the page
		injectPopup();
		
		// track the user's current mouse position
		$(document).mousemove(function(e){
			_mouseX = e.clientX;
			_mouseY = e.clientY;
		});	
		
		// handle dynamic DOM insertions
		$(document).bind("DOMNodeInserted", function(event) {
			$(getTagSelector(), event.target).each(function(index, element) {
				processElement(element);
			});
		});
		
		// process the original document
		processDocument();
		
		var elapsed = (new Date).getTime() - start;
		util.log("total initialization time: " + elapsed + " milliseconds");
	}
});