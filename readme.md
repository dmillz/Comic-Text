Comic Text
----------
- **Source Code**: https://github.com/dmillz/Comic-Text
- **Extension**: https://chrome.google.com/webstore/detail/hfpglafkfedcnnojpioconphfcelcljj
- **Author**: David Mills
- **Copyright**: David Mills
- **License**: This work is licensed under a [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/).

What is Comic Text?
-------------------
Comic Text is a Chrome extension that replaces the built-in Chrome tooltip to enable easier reading 
of the title-text for popular web comics, such as xkcd.

### Get it for free from the [Chrome Web Store](https://chrome.google.com/webstore/detail/hfpglafkfedcnnojpioconphfcelcljj)

New! Comic Text is now capable of scanning the entire page and replacing tooltips for *any* page element, 
not just images. Turn on the option by accessing the Comic Text extension options.

What's wrong with Chrome's mouseover text tooltips?
---------------------------------------------------
In years past, Chrome's title text tooltips didn't last long enough to read the entirety of the mouseover 
title text on many popular web comics, such as [xkcd](xkcd.com). By default, Chrome's tooltips disappeared
after about 5 seconds; but with Comic Text installed, they will last as long as your mouse remains over the image. 

Chrome's default [tooltip behavior was fixed in 2014](https://issues.chromium.org/issues/40266368), but this
extension still improves tooltip behavior and enables customization of the appearance of the tooltip text for
improved accessibility.


Does this extension work on websites other than xkcd.com?
---------------------------------------------------------
Yes! By default, the Comic Text will "just work" when browsing xkcd.com, and you may use the extension options
to customize the styling of the popup, or to enable Comic Text on your other favorite sites. 

Access the extension options by clicking [Puzzle Piece Icon] > Comic Text [3-dot menu] > Options)

Why does the extension require permission to access "Your data on all websites"?
--------------------------------------------------------------------------------
The extension works by modifying the HTML/CSS of any pages that are on the whitelist. On image mouseover, the 
script removes any existing title text of the image in order to suppress the built-in tooltips, and then pops-up a new DOM element, cleverly styled to mimic the default Chrome tooltip.

The extension requires the "Your data on all websites" persmission so that it can modify the page you're browsing in this manner, but that's the only thing it does. It does not save any information (besides it's own options), nor does it communicate with the outside world. 

Comic Text doesn't seem to work on &lt;my favorite site&gt;.
-------------------------------------------------------
If you find a bug, or just have a question, please [submit it as an issue](https://github.com/dmillz/Comic-Text/issues).

The Comic Text popup sometimes gets in my way.
----------------------------------------------
You may dismiss the Comic Text tooltip by right-clicking on it.

# Thank you, Randall Munroe

Thank you, Randall Munroe, for the hilarious web comic, and also for releasing your work under the [Creative Commons Attribution-NonCommercial 2.5 License](http://creativecommons.org/licenses/by-nc/2.5/). All of Comic Text's icons, images, screenshots, and inspiration have been derived from [xkcd](http://xkcd.com).


Copyright & License
-------------------

Copyright (c) David Mills. 

This work is released under the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/). If you are using this code for commercial purposes, the attribution must be public and prominent.
