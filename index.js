(function () {
"use strict"

window.addEventListener("DOMContentLoaded", function () {
    var rect = new SVGRect(100, 100)
    rect.setStrokeColor("black")
    rect.setStrokeWidth(3)

    var svgRoot = new SVGRoot(400, 400)
    svgRoot.addAt(rect, 100, 100)
    svgRoot.addToDocumentBodyWithId("logo")
})


var SVGElement = function (name) {
    this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", name)
}

SVGElement.prototype.setCoords = function (x, y) {
    this._svgElement.setAttribute("x", x)
    this._svgElement.setAttribute("y", y)
}

SVGElement.prototype.rawSVGElement = function () {
    return this._svgElement
}


var SVGRoot = function (width, height) {
    SVGElement.call(this, "svg")
    this._svgElement.style.width = width + "px"
    this._svgElement.style.height = height + "px"
}
SVGRoot.prototype = Object.create(SVGElement.prototype)
SVGRoot.prototype.constructor = SVGRoot

SVGRoot.prototype.addToDocumentBodyWithId = function (id) {
    this._svgElement.setAttribute("id", id)
    document.body.appendChild(this._svgElement)
}

SVGRoot.prototype.addAt = function (svgObj, x, y) {
    svgObj.setCoords(x, y)
    this._svgElement.appendChild(svgObj.rawSVGElement())
}


var SVGShape = function (elementName) {
    SVGElement.call(this, elementName)

}
SVGShape.prototype = Object.create(SVGElement.prototype)
SVGShape.prototype.constructor = SVGShape

SVGShape.prototype.setStrokeColor = function (color) {
    this._svgElement.style.stroke = color
}

SVGShape.prototype.setStrokeWidth = function (width) {
    this._svgElement.style.strokeWidth = width
}


var SVGRect = function (width, height) {
    SVGShape.call(this, "rect")
    this._svgElement.setAttribute("width", width)
    this._svgElement.setAttribute("height", height)
}
SVGRect.prototype = Object.create(SVGShape.prototype)
SVGRect.prototype.constructor = SVGRect

})()
