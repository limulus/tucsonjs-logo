"use strict"

var SVGShape = require("./SVGShape.js")

var SVGRect = module.exports = function (width, height) {
    SVGShape.call(this, "rect")
    this.rawSVGElement().setAttribute("width", width)
    this.rawSVGElement().setAttribute("height", height)
}
SVGRect.prototype = Object.create(SVGShape.prototype)
SVGRect.prototype.constructor = SVGRect
