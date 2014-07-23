"use strict"

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


