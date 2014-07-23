"use strict"

var SVGElement = require("./SVGElement.js")

var SVGShape = module.exports = function (elementName) {
    SVGElement.call(this, elementName)
}
SVGShape.prototype = Object.create(SVGElement.prototype)
SVGShape.prototype.constructor = SVGShape

SVGShape.prototype.setStrokeColor = function (color) {
    this.rawSVGElement().style.stroke = color
}

SVGShape.prototype.setStrokeWidth = function (width) {
    this.rawSVGElement().style.strokeWidth = width
}
