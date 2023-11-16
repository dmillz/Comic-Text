import { getOptions } from "./options.js";
import { updateCssVersion } from "./util.js";

// upgrade the CSS saved in local storage, if necessary
updateCssVersion();

// handle messages from the front-end
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {        
        switch(message.method) {
            case "getOptions":
                getOptions().then(options => sendResponse(options));
                break;

            default:
                throw "Did not recognize the requested method: " + message.method;
        }
    }
);
