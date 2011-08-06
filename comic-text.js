// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds
var _offsetX = 0; // pixels from mouse
var _offsetY = 22; // pixels from mouse

// member vars
var _mouseX;
var _mouseY;

var _$popup;
var _currentImage;
var _currentImageTitle;

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

	function processDocument() {
		
		var start = (new Date).getTime();
		var count = 0;
		$("img").each(function(index, image) {
			processImage(image);
			count++;
		});		
		var diff = (new Date).getTime() - start;
		util.log("generated " + count + " popups in " + diff + " milliseconds");
		
		
	}
	
	function hidePopup() {
		util.log("hiding popup...");
		
		//restore the original title
		_currentImage.title = _currentImageTitle;
		
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
		util.log("top: " + top + " popupHeight: " + _$popup.outerHeight() + " windowHeight: " +  $(window).height());
		if (top + _$popup.outerHeight() > $(window).height()) {
			top -= (top + _$popup.outerHeight()) - $(window).height();
		}
		
		return { top: top, 
				 left: left };
	}
	
	function processImage(image) {
		if (!image.title) {
			return;
		}
		
		util.log("processing image with title: " + image.title);
		
		// handle mouseovers on the image itself
		var isOverImage = false;
		$(image).hover(
			function(e) { // mouseover
				
				isOverImage = true;
				
				// no need to continue if the mouse just exited the popup					
				if (e.relatedTarget === _$popup.get(0)) {
					return;
				}
				
				// save the image's original title for future reference
				_currentImageTitle = image.title;
					
				// remove the title to suppress the built-in tooltip
				image.title = "";
				_currentImage = image;				
				
				// update the popup's text
				_$popup.text(_currentImageTitle);

				// delay the appearance of the popup just slightly, to mimic Chrome
				setTimeout(function() {
				
					// make sure we're still over the image, 
					if (!isOverImage) {
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
			
				isOverImage = false;
				
				// don't hide the popup if the mouse just entered the popup					
				if (e.relatedTarget !== _$popup.get(0)) {
					hidePopup();
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
						.appendTo("body");
		
		// handle mouseouts on the popup
		_$popup.mouseout(function(e) { 				
			// don't hide the popup if the mouse just entered the image
			if (e.relatedTarget !== _currentImage) {
				hidePopup();																
			}
		});
	}
	
	// initialize everything
	if (isWhitelisted(window.location.host)) {
		
		var start = (new Date).getTime();
		
		util.log("current site on the list!");
		
		injectPopup();
		
		// track the user's current mouse position
		$(document).mousemove(function(e){
			_mouseX = e.clientX;
			_mouseY = e.clientY;
		});	
		
		// handle dynamic DOM insertions
		$(document).bind("DOMNodeInserted", function(event) {
			$("img", event.target).each(function(index, image) {
				processImage(image);
			});
		});
		
		// process the original document
		processDocument();
		
		var diff = (new Date).getTime() - start;
		util.log("total initialization time: " + diff + " milliseconds");
	}
});