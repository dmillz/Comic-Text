const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// performance timer
const start = (new Date).getTime();

// Configuration
const MOUSEOVER_DELAY = 100; // milliseconds
const FADE_DURATION = 140; // milliseconds
const OFFSET_X = 10; // pixels from mouse
const OFFSET_Y = 22; // pixels from mouse

let mouseX;
let mouseY;
let popupEl;
let currentElement;
const elementInfos = [];

// load the options from the back-end
chrome.runtime.sendMessage({ method: "getOptions" }, function (opts) {

	function log(msg) {
		console.log(msg);
	}

	function getWhitelistRegexs(whitelist) {
		// parse out the domains and turn them to regexs
		var regexs = [];
		var parts = whitelist.split(/\s+/);
		for (var i = 0; i < parts.length; i++) {
			// allow the user to simply enter "*" for all sites
			var pattern = parts[i] === "*" ? ".*" : parts[i]; 
			regexs.push(new RegExp(pattern));
		}	
		return regexs;
	};

	function isWhitelisted(url) {
		var regexs = getWhitelistRegexs(opts.whitelist);
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
		var top = mouseY + OFFSET_Y;
		var left = mouseX + OFFSET_X;

		// reposition the popup if it runs up against the edge of the screen
		if (left + popupEl.offsetWidth > window.offsetWidth) {
			left -= (left + popupEl.offsetWidth) - window.offsetWidth;
		}
		if (top + popupEl.offsetHeight > window.offsetHeight) {
			top -= (top + popupEl.offsetHeight) - window.offsetHeight;
		}

		return { top, left };
	}

	function htmlEncode(text) {
		var el = document.createElement('textarea');
		el.innerText = text;
		return el.innerHTML;
	};

	// function multiLineHtmlEncode(value) {
	// 	var lines = value.split(/\r\n|\r|\n/);
	// 	for (var i = 0; i < lines.length; i++) {
	// 		lines[i] = htmlEncode(lines[i]);
	// 	}
	// 	return lines.join("\r\n");
	// };

	function prepareText(text) {
		return htmlEncode(text)
			.replace(/\r\n|\r|\n/g, "<br/>");;
	};

	function showPopup(info) {

		var text = prepareText(info.title);
		popupEl.innerHTML = text;
		popupEl.style.display = "none";

		log("starting countdown to show : " + info.title);
		setTimeout(function () {
			if (info.isMouseOver) {

				// show the popup
				log("showing popup: " + info.title);
				var position = getPosition();
				popupEl.css({
					"top": position.top + "px",
					"left": position.left + "px"
				});

				popupEl.fadeIn(FADE_DURATION);
			}
		}, MOUSEOVER_DELAY);
	}

	function injectPopup() {

		// inject our CSS into the page
		const styleEl = document.createElement("style");
		styleEl.innerHTML = opts.css;
		document.body.appendChild(styleEl);

		// inject the one-and-only popup
		popupEl = document.createElement("div");
		popupEl.classList.add("comic-text-popup");
		popupEl.style.position = "fixed";
		popupEl.style.display = "none";
		popupEl.style.zIndex = "99999999";
		document.body.appendChild(popupEl);
						
						
		// dismiss the popup on right click
		popupEl.addEventListener("mousedown", function(e) {
			
			log("popup was clicked, button #: " + e.button);
			
			if (e.button != 2) { // right click only
				return;
			}
			
			// suppress the context menu
			e.preventDefault();

			// hide it
			if (popupEl.is(":visible")) {
				popupEl.hide();
			}
		});
		
		// // cancel the context menu if the popup was just dismissed
		// document.addEventListener("contextmenu", function(e){
		// 	if (cancelNext) {
		// 		cancelNext = false;
		// 		return false;
		// 	}
		// });
	}

	function onMouseLeave(e, elementInfo) {

		// if we moused into the popup, rebind the mouseleave handler to the popup
		if (e.relatedTarget === popupEl) {
			log("rebinding mouseleave to popup");
			popupEl.addEventListener("mouseleave", e => onMouseLeave(e, elementInfo), { once: true });
			return;
		}

		// if we moused from the popup into the current element, rebind to the element
		if (e.relatedTarget === currentElement) {
			log("rebinding mouseleave to original element");
			currentElement.addEventListener("mouseleave", e => onMouseLeave(e, elementInfo), { once: true });
			return;
		}

		// mark the element as not having the mouse over it
		var elementInfo = e.data.elementInfo;
		log("marking as !isMouseOver: " + elementInfo.title);
		elementInfo.isMouseOver = false;

		// remove this item from the stack
		var info = elementInfos.pop();

		// restore the element's original title
		info.element.title = info.title;
		printStack("popped", info);
	}

	function printStack(operation, info) {
		var s = info ? info.title : info;
		log(operation + " an element titled '" + s + "' -- stack size: " + elementInfos.length);
		log("stack: " + elementInfos.map(function (o) { return o.title; }).join(", "));
	}

	function processElement(element, callback) {

		log("processing element: " + element.title);

		// push an entry onto the stack
		var info = {
			element,
			title,
			isMouseOver: true
		};
		callback(info);

		// suppress the built-in tooltip
		element.title = "";

		// handle mouseouts so we can know if the mouse leaves 
		// the element before the popup ever appears
		element.addEventListener("mouseleave", e => onMouseLeave(e, info), { once: true });
	}

	// keep track of where the mouse is and show popups as needed
	function onMouseMove(e) {

		mouseX = e.clientX;
		mouseY = e.clientY;

		// don't continue unless we're on a new element
		if (currentElement === e.target) {
			return;
		}

		// the tooltip itself doesn't count
		if (e.target === popupEl) {
			return;
		}
		
		// ignore <embed>s and <object>s, they don't play by the rules
		if (e.target.tagName === "EMBED" ||
		    e.target.tagName === "OBJECT") {
			return;
		} 		

		// we're on a new element
		currentElement = e.target;
		log("------- new element --------");

		// so hide the popup
		popupEl.style.display = "none";

		// If we weren't previously over the current element, it may
		// have a title. If so, let's process it
		debugger;
		if (currentElement.title && currentElement.matches(getTagSelector())) {

			// handle the current element
			processElement(currentElement, function (info) {
				elementInfos.push(info);
				printStack("pushed", info);
			});

			// we need to suppress tooltips for any parent elements, too
			let element = currentElement;
			while(element.parentNode) {
				element = element.parentNode;
				if (element) {
					processElement(element, function (info) {
						elementInfos.unshift(info);
						printStack("unsifted", info);
					});
				}
			}
		}

		// show the popup. info is at the top of the stack
		if (elementInfos.length > 0) {
			showPopup(elementInfos[elementInfos.length - 1]);
		}
	}

	// initialize everything
	if (isWhitelisted(window.location.host)) {

		log("current site is on the list!");

		// inject our css & dom element into the page
		injectPopup();

		// show tooltips by tracking mouse movement and acting accordingly
		document.addEventListener("mousemove", onMouseMove);

		var elapsed = (new Date).getTime() - start;
		log("total initialization time: " + elapsed + " milliseconds");
	}
});