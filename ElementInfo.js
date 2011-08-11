/** 
* @namespace model
*/ 
var model = model || {};

/**
* @class ElementInfo
*/

model.ElementInfo = function (element, title, isMouseOver) {
	this.element = element;
	this.title = title;
	this.isMouseOver = isMouseOver;
}
