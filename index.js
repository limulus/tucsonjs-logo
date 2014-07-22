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


var SVGRoot = function (width, height) {
    SVGElement.call(this, "svg")
    this.rawSVGElement().style.width = width + "px"
    this.rawSVGElement().style.height = height + "px"
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


var SVGShape = function (elementName) {
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


var SVGRect = function (width, height) {
    SVGShape.call(this, "rect")
    this.rawSVGElement().setAttribute("width", width)
    this.rawSVGElement().setAttribute("height", height)
}
SVGRect.prototype = Object.create(SVGShape.prototype)
SVGRect.prototype.constructor = SVGRect

})()
