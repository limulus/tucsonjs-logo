"use strict"

var SVGShape = require("./SVGShape.js")
var inherits = require("util").inherits

var SVGPath = module.exports = function () {
  SVGShape.call(this, "path")

  this._origin = undefined
  this._segments = []
}
inherits(SVGPath, SVGShape)

SVGPath.prototype.setPathOrigin = function (x, y) {
  this._origin = { "command": "M", "x": x, "y": y }
}

SVGPath.prototype.addLineSegment = function (x, y) {
  this._segments.push({ "command": "l", "x": x, "y": y })
}

SVGPath.prototype.rawSVGElement = function () {
  var element = SVGShape.prototype.rawSVGElement.call(this)
  if (! element.getAttribute("d") && this._origin) {
    element.setAttribute("d", this._pathCommandString())
  }
  return element
}

SVGPath.prototype._pathCommandString = function () {
  return [this._origin]
    .concat(this._segments)
    .map(function (item) {
      return item["command"] +" "+ item["x"] +" "+ item["y"]
    })
    .concat(["Z"])
    .join(" ")
}
