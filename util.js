import { config } from "./config.js";
import { loadUserCssVersion, resetCss, saveUserCssVersion } from "./options.js";

export const log = function(o) {
	if (config.isDebug) {
		if (typeof(o) === "string") {
			console.log("(Comic Text) " + o);
		}
		else {
			console.log(o);
		}
	}
};

export const getWhitelistRegexs = function(whitelist) {
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

export const updateCssVersion = async function() {
	var userVersion = await loadUserCssVersion();
	log("User has CSS version " + userVersion);
	log("Current CSS version is " + config.currentCssVersion);
	if (isNaN(userVersion) || userVersion != config.currentCssVersion) {
		log("Upgrading CSS version");
		
		// Don't overwrite CSS if we've previsouly saved a 
		// CSS version #, and they've customized their CSS.
		if (!isNaN(userVersion) && userHasModifiedCss()) {
			// Instead, just update the version number.
			log("User has modified CSS that won't be touched, updating version number to " + config.currentCssVersion);
			saveUserCssVersion(config.currentCssVersion);
			return;
		}
		
		// otherwise, update the css the to latest version
		resetCss();
		saveUserCssVersion(config.currentCssVersion);
		log("CSS has been updated to current version " + config.currentCssVersion);
	}
};
	
export const userHasModifiedCss = function() {
	// search the old versions for a match
	var userCss = loadCss();
	for (var i = 0; i <= config.currentCssVersion; i++) {
		if (userCss === config.cssVersions[i]) {
			return false;
		}
	}
	return true;
};

export const htmlEncode = function(value) {
	return $('<div/>').text(value).html();
};

export const multiLineHtmlEncode = function(value) {
	var lines = value.split(/\r\n|\r|\n/);
	for (var i = 0; i < lines.length; i++) {
		lines[i] = util.htmlEncode(lines[i]);
	}
	return lines.join("\r\n");
};

export const prepareText = function(text) {
	return util.multiLineHtmlEncode(text)
			.replace(new RegExp( "\\r\\n", "g" ), "<br/>");;
};
