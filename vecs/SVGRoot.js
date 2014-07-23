"use strict"

var SVGElement = require("./SVGElement.js")

var SVGRoot = module.exports = function (width, height) {
    SVGElement.call(this, "svg")
    this.rawSVGElement().setAttribute("version", "1.1")
    this.rawSVGElement().setAttribute("width", width + "px")
    this.rawSVGElement().setAttribute("height", height + "px")
}
SVGRoot.prototype = Object.create(SVGElement.prototype)
SVGRoot.prototype.constructor = SVGRoot

SVGRoot.prototype.addToDocumentBodyWithId = function (id) {
    this.rawSVGElement().setAttribute("id", id)
    document.body.appendChild(this.rawSVGElement())
}

SVGRoot.prototype.addAt = function (svgObj, x, y) {
    svgObj.setCoords(x, y)
    this.rawSVGElement().appendChild(svgObj.rawSVGElement())
}

SVGRoot.prototype.setViewBox = function (val) {
    this.rawSVGElement().setAttribute("viewBox", val)
}

SVGRoot.prototype.setPreserveAspectRatio = function (val) {
    this.rawSVGElement().setAttribute("preserveAspectRatio", val)
}


