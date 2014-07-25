"use strict"

var SVGElement = require("./SVGElement.js")
  , SVGEvent = require("./SVGEvent.js")
  , inherits = require("util").inherits

var SVGRoot = module.exports = function (width, height) {
    SVGElement.call(this, "svg")
    this.rawSVGElement().setAttribute("version", "1.1")
    this.rawSVGElement().setAttribute("width", width + "px")
    this.rawSVGElement().setAttribute("height", height + "px")
}
inherits(SVGRoot, SVGElement)

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

SVGRoot.prototype.observeTouchGesture = function (eventHandler) {
    var _handleEvent = function (e) {
        e.preventDefault()
        e.stopPropagation()
        eventHandler(new SVGEvent(e))
    }

    this.rawSVGElement().addEventListener("mousedown", _handleEvent, false)
    this.rawSVGElement().addEventListener("mousemove", _handleEvent, false)
    this.rawSVGElement().addEventListener("mouseup", _handleEvent, false)
    this.rawSVGElement().addEventListener("touchmove", _handleEvent, false)
    this.rawSVGElement().addEventListener("touchdown", _handleEvent, false)
    this.rawSVGElement().addEventListener("touchup", _handleEvent, false)
}
