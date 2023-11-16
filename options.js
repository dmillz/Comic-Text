import { config } from "./config.js";

// function loadOption(name, defaultValue) {
// 	var option = localStorage[name];
// 	if (option == null) {
// 		// load default
// 		option = defaultValue;
// 		localStorage[name] = option;
// 	}
// 	return option;
// }	

// function saveOption(name, value) {
// 	localStorage[name] = value;
// }

async function loadOption(name, defaultValue) {
	var option = (await chrome.storage.sync.get(name))[name];
	if (option == null) {
		// load default
		option = defaultValue;
		await chrome.storage.sync.set({ [name]: option });
	}
	return option;
}	

async function saveOption(name, value) {
	await chrome.storage.sync.set({ [name]: value });
}
	
// tags
export const saveTags = async function(tags) {
	await saveOption("tags", tags);
};
export const loadTags = async function() {
	return await loadOption("tags", config.defaultTags);
}

// whitelist
export const saveWhitelist = async function(whitelist) {
	await saveOption("whitelist", whitelist);
};
export const loadWhitelist = async function() {
	return await loadOption("whitelist", config.defaultWhitelist);
};

// css 
export const saveCss = async function(css) {
	await saveOption("css", css);
};
export const loadCss = async function() {
	return await loadOption("css", config.cssVersions[config.currentCssVersion]);		
};

export const resetCss = async function() {
	await saveCss(config.cssVersions[config.currentCssVersion]);
};

// css version
export const loadUserCssVersion = async function() {
	return parseInt((await chrome.storage.sync.get("userCssVersion")).userCssVersion);	
};
export const saveUserCssVersion = async function(version) {
	await saveOption("userCssVersion", ""+version);
};

export const getOptions = async function() {
	return {
		whitelist: await loadWhitelist(),
		css: await loadCss(),
		userCssVersion: await loadUserCssVersion(),
		tags: await loadTags()
	};
};
