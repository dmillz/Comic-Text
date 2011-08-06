// namespace options
var options = options || {};

(function() {

	function loadOption(name, defaultValue) {
		var option = localStorage[name];
		if (option == null) {
			// load default
			option = defaultValue;
			localStorage[name] = option;
		}
		return option;
	}	

	function saveOption(name, value) {
		localStorage[name] = value;
	}
	
	// tags
	options.saveTags = function(tags) {
		saveOption("tags", tags);
	}
	options.loadTags = function() {
		return loadOption("tags", config.defaultTags);
	}		

	// whitelist
	options.saveWhitelist = function(whitelist) {
		saveOption("whitelist", whitelist);
	}
	options.loadWhitelist = function() {
		return loadOption("whitelist", config.defaultWhitelist);
	}

	// css 
	options.saveCss = function(css) {
		saveOption("css", css);
	}
	options.loadCss = function() {
		return ("css", config.cssVersions[config.currentCssVersion]);		
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
		this.tags = options.loadTags();
	}

	options.getOptions = function() {
		return new OptionsContainer();
	}
})();