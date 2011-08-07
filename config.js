// namespace config
var config = config || {};

// debug mode
config.isDebug = false;

// default list of html elements (* for all)
config.defaultTags = "img";

// whitelist
config.defaultWhitelist = "xkcd.com";

// css
config.currentCssVersion = 5;

config.cssVersions = [ 

// version 0
"/* Mimic Chrome as closely as possible */\n\
div.comic-text-popup {\n\
	display: none;\n\
	position: absolute;\n\
	max-width: 300px;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	padding: 3px;\n\
	font-size: 12px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	border: 1px solid #666;\n\
	color: 666;\n\
	text-align: left;\n\
	text-decoration: none;\n\
	font-variant: normal;\n\
}",

// version 1
"/* Mimic Chrome as closely as possible */\n\
div.comic-text-popup {\n\
	display: none;\n\
	position: absolute;\n\
	max-width: 300px;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	padding: 3px;\n\
	font-size: 12px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	border: 1px solid #666;\n\
	color: 666;\n\
	text-align: left;\n\
	text-decoration: none;\n\
	font-variant: normal;\n\
	z-index: 99999999;\n\
}",

// version 2
"/* Mimic Chrome as closely as possible */\n\
div.comic-text-popup {\n\
	display: none;\n\
	position: absolute;\n\
	max-width: 300px;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	padding: 4px;\n\
	font-size: 12px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	font-weight: normal;\n\
	font-variant: normal;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	border: 1px solid #777;\n\
	color: #666;\n\
	text-align: left;\n\
	text-decoration: none;\n\
	line-height: normal;\n\
	letter-spacing: normal;\n\
	text-shadow: none;\n\
	text-transform: none;\n\
	list-style: none;\n\
	text-indent: 0;\n\
	z-index: 99999999;\n\
}",

// version 3
"/* Mimic Chrome as closely as possible */\n\
div.comic-text-popup {\n\
	display: none;\n\
	position: absolute;\n\
	max-width: 300px;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	padding: 2px 4px;\n\
	font-size: 12px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	font-weight: normal;\n\
	font-variant: normal;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	-webkit-box-shadow: 2px 2px 3px #676767;\n\
	border: 1px solid #767676;\n\
	color: #454545;\n\
	text-align: left;\n\
	text-decoration: none;\n\
	line-height: normal;\n\
	letter-spacing: normal;\n\
	text-shadow: none;\n\
	text-transform: none;\n\
	list-style: none;\n\
	text-indent: 0;\n\
	z-index: 99999999;\n\
}",

// version 4
"/* Mimic Chrome as closely as possible */\n\
div.comic-text-popup {\n\
	max-width: 300px;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	padding: 2px 4px;\n\
	font-size: 12px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	font-weight: normal;\n\
	font-variant: normal;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	-webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.65);\n\
	border: 1px solid #767676;\n\
	color: #454545;\n\
	text-align: left;\n\
	text-decoration: none;\n\
	line-height: normal;\n\
	letter-spacing: normal;\n\
	text-shadow: none;\n\
	text-transform: none;\n\
	list-style: none;\n\
	text-indent: 0;\n\
	\n\
	/* don't mess with these */\n\
	display: none;\n\
	position: absolute;\n\
	z-index: 99999999;\n\
}",

// version 5
"div.comic-text-popup {\n\
	font-size: 12px;\n\
	max-width: 300px;\n\
	color: #454545;\n\
	border: 1px solid #767676;\n\
	padding: 2px 4px;\n\
	font-family: 'Segoe UI', Calibri, Helvetica, Verdana, sans-serif;\n\
	font-weight: normal;\n\
	background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#e4e5f0));\n\
	font-variant: normal;\n\
	cursor: default;\n\
	-webkit-border-radius: 4px;\n\
	-webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.65);\n\
	text-align: left;\n\
	text-decoration: none;\n\
	line-height: normal;\n\
	letter-spacing: normal;\n\
	text-shadow: none;\n\
	text-transform: none;\n\
	list-style: none;\n\
	text-indent: 0;\n\
}"];

