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
	
	// we may continue with everything else now that the options have loaded
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
			
			// handle mouseouts on the popup
			$popup.mouseout(function(e) { 				
				// don't hide it if the mouse just entered the image
				if (e.relatedTarget !== image) {
					hidePopup();																
				}
			});
			
			// handle mouseovers on the image itself
			var isOverImage = false;
			$(image).hover(
				function(e) { // mouseover
					
					isOverImage = true;
					
					// don't do this if the mouse just exited the popup					
					if (e.relatedTarget !== $popup.get(0)) {
						
						// remove the title to suppress the built-in tooltip
						image.title = "";
										
						// delay the appearance of the popup just slightly, to mimic Chrome
						setTimeout(function() {
							// make sure we're still over the image, 
							if (isOverImage) {
								console.log("showing popup...");
								
								var top = _mouseY + _offsetY;
								var left = _mouseX + _offsetX;
								
								// reposition the popup if it runs up against the edge of the screen
								if (left + $popup.outerWidth() > $(window).width()) {
									left -= (left + $popup.outerWidth()) - $(window).width();
								}

								if (top + $popup.outerHeight() > $(window).height()) {
									top -= (top + $popup.outerHeight()) - $(window).height();
								}
								
								// show the popup
								$popup.css({ 
											"top": top + "px",
											"left": left + "px"
											});
								$popup.fadeIn(_fadeDuration);
							}
						}, _mouseoverDelay);
					}
				}, 
				function(e) { // mouseout
				
					isOverImage = false;
					
					// don't hide it if the mouse just entered the popup					
					if (e.relatedTarget !== $popup.get(0)) {
						hidePopup();
					}
				}			
			);
			
		}  
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