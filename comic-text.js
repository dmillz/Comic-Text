// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds

// member vars
var _isOverImage = false;
var _isOverPopup = false;
var _mouseX;
var _mouseY;
var _options;

// load the options from the back-end
chrome.extension.sendRequest({method: "getOptions"}, function(response) {
	_options = response;
	// we may continue with everything else now that the options have loaded.
	
	function isWhitelisted(url) {
		var regexs = util.getWhitelistRegexs(_options.whitelist);
		for (var i = 0; i < regexs.length; i++) {
			if (regexs[i].test(url)) {
				return true;
			}
		}	
		return false;
	}

	function processImage(image) {
		if (image.title) {
			console.log("processing image with title: " + image.title);
			var originalTitle = image.title;
			
			var $popup = $("<div/>")
							.addClass("comic-text-popup")
							.text(image.title)
							.appendTo($("body"));
							
			function hidePopup(originalTitle) {
				if (!_isOverImage && !_isOverPopup) {
					console.log("hiding popup...");
					
					//restore the original title
					image.title = originalTitle;
					
					// hide the popup
					$popup.hide();					
				}
			}
			
			// handle mouseovers on the popup so we can keep it visible during mouseover
			$popup.hover(
				function() { // mouseover
					_isOverPopup = true;
				},
				function() { // mouseout
				
					_isOverPopup = false;
					
					// wait a moment so the mouseover event on the image has a chance to fire
					setTimeout(function() {
						hidePopup();											
					}, 10);
				}
			);
			
			// handle mouseovers on the image itself
			$(image).hover(
				function(e) { 
					
					_isOverImage = true;
					
					// remove the title to suppress the built-in tooltip
					image.title = "";
									
					// delay the appearance of the popup just slightly, to mimic Chrome
					setTimeout(function() {

						if (_isOverImage && !$popup.is(":visible")) {
							console.log("showing popup...");
							
							// show the popup
							$popup.css({ 
										"top": _mouseY + "px",
										"left": _mouseX + "px"
										});
							$popup.fadeIn(_fadeDuration);
						}
					}, _mouseoverDelay);
					
				}, 
				function(e) { // mouseout
					
					_isOverImage = false;
					
					// wait a moment so the mouseover event on the popup has a chance to fire
					setTimeout(function() {
						hidePopup();											
					}, 10);
				}			
			);
			
		}  
	}

	function processInsertion(node) {
		$("img", node).each(function(index, image) {
			processImage(image);
		});
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {
		console.log("we're on the list!");
		
		// handle dynamic DOM insertions
		$(document).bind('DOMNodeInserted', function(event) {
			processInsertion(event.target);
		});
		
		// process the original document
		$(document).ready(function() {
			$("img").each(function(index, image) {
				processImage(image);
			});
		});
		
		// track the user's current mouse position
		$(document).mousemove(function(e){
			_mouseX = e.pageX;
			_mouseY = e.pageY;
		});	
		
		// inject our CSS into the page
		$("<style/>")
			.attr("type", "text/css")
			.html(_options.css)
			.appendTo($("body"));
	}
});