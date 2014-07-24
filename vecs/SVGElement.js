"use strict"

var SVGEvent = require("./SVGEvent.js")

var SVGElement = module.exports = function (name) {
    this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", name)
}

SVGElement.prototype.rawSVGElement = function () {
    return this._svgElement
}

SVGElement.prototype.name = function () {
    return this.rawSVGElement().tagName.toLowerCase()
}

SVGElement.prototype.setCoords = function (x, y) {
    // Also accept SVGPoint as the sole parameter.
    if (x instanceof SVGPoint) {
        y = x.y
        x = x.x
    }

    // Determine which attributes we need to set. It's
    // different for different SVG elements like circle.
    var xAttrib = "x", yAttrib = "y"
    switch (this.name()) {
        case "circle":
            xAttrib = "cx"
            yAttrib = "cy"
            break
    }

    this.rawSVGElement().setAttribute(xAttrib, x)
    this.rawSVGElement().setAttribute(yAttrib, y)
}

SVGElement.prototype.observe = function (eventName, handler) {
    this.rawSVGElement().addEventListener(eventName, function (e) {
        handler(new SVGEvent(e))
    }, false)
}


