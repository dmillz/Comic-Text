// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds
var _offsetX = 0; // pixels from mouse
var _offsetY = 22; // pixels from mouse

// member vars
var _mousePageX;
var _mousePageY;
var _mouseClientX;
var _mouseClientY;

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

	function processImage(image) {
		if (!image.title) {
			return;
		}
		
		console.log("processing image with title: " + image.title);
			
		// save the image's original title for future reference
		var originalTitle = image.title;
		
		var $popup = $("<div/>")
						.addClass("comic-text-popup")
						.text(image.title)
						.appendTo($("body"));
						
		function hidePopup() {
			console.log("hiding popup...");
			
			//restore the original title
			image.title = originalTitle;
			
			// hide the popup
			$popup.hide();					
		}
		
		function getPosition() {
			var pageTop = _mousePageY + _offsetY;
			var pageLeft = _mousePageX + _offsetX;
			var clientTop = _mouseClientY + _offsetY;
			var clientLeft = _mouseClientX + _offsetX;
			
			// reposition the popup if it runs up against the edge of the screen
			if (clientLeft + $popup.outerWidth() > $(window).width()) {
				pageLeft -= (clientLeft + $popup.outerWidth()) - $(window).width();
			}
			console.log("top: " + top + " popupHeight: " + $popup.outerHeight() + " windowHeight: " +  $(window).height());
			if (clientTop + $popup.outerHeight() > $(window).height()) {
				pageTop -= (clientTop + $popup.outerHeight()) - $(window).height();
			}
			
			return { top: pageTop, 
					 left: pageLeft };
		}
		
		// handle mouseouts on the popup
		$popup.mouseout(function(e) { 				
			// don't hide the popup if the mouse just entered the image
			if (e.relatedTarget !== image) {
				hidePopup();																
			}
		});
		
		// handle mouseovers on the image itself
		var isOverImage = false;
		$(image).hover(
			function(e) { // mouseover
				
				isOverImage = true;
				
				// no need to continue if the mouse just exited the popup					
				if (e.relatedTarget === $popup.get(0)) {
					return;
				}
					
				// remove the title to suppress the built-in tooltip
				image.title = "";
								
				// delay the appearance of the popup just slightly, to mimic Chrome
				setTimeout(function() {
				
					// make sure we're still over the image, 
					if (!isOverImage) {
						return;
					}
					
					// show the popup
					console.log("showing popup...");
					var position = getPosition();
					$popup.css({ 
								"top": position.top + "px",
								"left": position.left + "px"
								});
					$popup.fadeIn(_fadeDuration);
					
				}, _mouseoverDelay);
			}, 
			function(e) { // mouseout
			
				isOverImage = false;
				
				// don't hide the popup if the mouse just entered the popup					
				if (e.relatedTarget !== $popup.get(0)) {
					hidePopup();
				}
			}			
		);
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {
		console.log("we're on the list!");
		
		// handle dynamic DOM insertions
		$(document).bind("DOMNodeInserted", function(event) {
			$("img", event.target).each(function(index, image) {
				processImage(image);
			});
		});
		
		// process the original document
		$("img").each(function(index, image) {
			processImage(image);
		});		
		
		// track the user's current mouse position
		$(document).mousemove(function(e){
			_mousePageX = e.pageX;
			_mousePageY = e.pageY;
			_mouseClientX = e.clientX;
			_mouseClientY = e.clientY;
		});	
		
		// inject our CSS into the page
		$("<style/>")
			.attr("type", "text/css")
			.html(opts.css)
			.appendTo($("body"));
	}
});