Comic Text
----------
- **Source Code**: https://github.com/dmillz/Comic-Text
- **Extension**: https://chrome.google.com/webstore/detail/hfpglafkfedcnnojpioconphfcelcljj
- **Author**: David Mills
- **Copyright**: 2011 David Mills
- **License**: This work is licensed under a [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/).

What is Comic Text?
-------------------
Comic Text is a Chrome extension that replaces the built-in Chrome tooltip to enable easier reading of the title-text for popular web comics, such as xkcd.

### Get it for free from the [Chrome Web Store](https://chrome.google.com/webstore/detail/hfpglafkfedcnnojpioconphfcelcljj)

What's wrong with Chrome's mouseover text tooltips?
---------------------------------------------------
They don't last long enough to read the entirety of the mouseover title text on many popular web comics, such as [xkcd](xkcd.com). By default, Chrome's tooltips disappear after about 5 seconds; but with Comic Text installed, they will last as long as your mouse remains over the image. [Other people](http://www.google.com/support/forum/p/Chrome/thread?tid=4f641efdaeb3c585) have [been annoyed by this behavior](http://code.google.com/p/chromium/issues/detail?id=1441).

Does this extension work on websites other than xckd.com?
---------------------------------------------------------
Yes! By default, the Comic Text will "just work" when browsing xkcd.com, and you may use the extension options to customize the styling of the popup, or to enable Comic Text on your other favorite sites. (Access the extension options by clicking [Wrench Icon] > Tools > Extensions, and then find the "Options" link under the Comic Text extension.)

Why does the extension require permission to access "Your data on all websites"?
--------------------------------------------------------------------------------
The extension works by modifying the HTML/CSS of any pages that are on the whitelist. On image mouseover, the script removes any existing title text of the image in order to suppress the built-in tooltips, and then pops-up a new DOM element, cleverly styled to mimic the default Chrome tooltip.

The extension requires the "Your data on all websites" persmission so that it can modify the page you're browsing in this manner, but that's the only thing it does. It does not save any information (besides it's own options), nor does it communicate with the outside world. 

Comic doesn't work on &lt;my favorite site&gt;!
-----------------------------------------
If you find a bug, or just have a question, please [submit it as an issue](https://github.com/dmillz/Comic-Text/issues).

Copyright & License
-------------------

Copyright (c) 2011 David Mills, 

This work is released under the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/)