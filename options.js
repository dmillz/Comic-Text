// namespace options
var options = options || {};

// whitelist
options.saveWhitelist = function(whitelist) {
	localStorage["whitelist"] = whitelist;
}

options.loadWhitelist = function() {
	var whitelist = localStorage["whitelist"];
	if (whitelist == null) {
		// default to xkcd.com
		whitelist = config.defaultWhitelist;	
	}
	return whitelist;
}

// css 
options.saveCss = function(css) {
	localStorage["css"] = css;
}

options.loadCss = function() {
	var css = localStorage["css"];
	if (css == null) {
		// default
		css = config.defaultCss;		
	}
	return css;
}

options.resetCss = function() {
	options.saveCss(config.cssVersions[config.currentCssVersion]);
}

// css version
options.loadUserCssVersion = function() {
	return parseInt(localStorage["userCssVersion"]);	
}

options.saveUserCssVersion = function(version) {
	localStorage["userCssVersion"] = ""+version;
}

// class OptionsContainer
function OptionsContainer() {
	this.whitelist = options.loadWhitelist();
	this.css = options.loadCss();
	this.userCssVersion = options.loadUserCssVersion();
}

options.getOptions = function() {
	return new OptionsContainer();
}
