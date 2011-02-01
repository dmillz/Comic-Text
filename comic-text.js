// Configuration
var _mouseoverDelay = 100; // milliseconds
var _fadeDuration = 140; // milliseconds
var _offsetX = 0; // pixels from mouse
var _offsetY = 22; // pixels from mouse

// member vars
var _mouseX;
var _mouseY;

// load the options from the back-end
chrome.extension.sendRequest({method: "getOptions"}, function(response) {
	
	// we may continue with everything else now that the options have loaded.
	var opts = response;
	
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
		if (image.title) {
			console.log("processing image with title: " + image.title);
			
			// track the mouse per-image
			var isOverPopup = false;
			var isOverImage = false;
			
			// save the image's original title for future reference
			var originalTitle = image.title;
			
			var $popup = $("<div/>")
							.addClass("comic-text-popup")
							.text(image.title)
							.appendTo($("body"));
							
			function hidePopup(originalTitle) {
				if (!isOverImage && !isOverPopup) {
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
					isOverPopup = true;
				},
				function() { // mouseout
				
					isOverPopup = false;
					
					// wait a moment so the mouseover event on the image has a chance to fire
					setTimeout(function() {
						hidePopup();											
					}, 10);
				}
			);
			
			// handle mouseovers on the image itself
			$(image).hover(
				function(e) { 
					
					isOverImage = true;
					
					// remove the title to suppress the built-in tooltip
					image.title = "";
									
					// delay the appearance of the popup just slightly, to mimic Chrome
					setTimeout(function() {

						if (isOverImage && !$popup.is(":visible")) {
							console.log("showing popup...");
							
							// show the popup
							$popup.css({ 
										"top": (_mouseY + _offsetY) + "px",
										"left": (_mouseX + _offsetX) + "px"
										});
							$popup.fadeIn(_fadeDuration);
						}
					}, _mouseoverDelay);
					
				}, 
				function(e) { // mouseout
					
					isOverImage = false;
					
					// wait a moment so the mouseover event on the popup has a chance to fire
					setTimeout(function() {
						hidePopup();											
					}, 10);
				}			
			);
			
		}  
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {
		console.log("we're on the list!");
		
		// handle dynamic DOM insertions
		$(document).bind('DOMNodeInserted', function(event) {
			$("img", event.target).each(function(index, image) {
				processImage(image);
			});
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
			.html(opts.css)
			.appendTo($("body"));
	}
});