"use strict"

var vecs = require("./vecs")

window.addEventListener("DOMContentLoaded", function () {
    var crepuscularRays = new CrepuscularRays()
    crepuscularRays.svgRoot().addToDocumentBodyWithId("crepuscularRays")
    crepuscularRays.draw()
}, false)


var CrepuscularRays = function () {
    this._svgRoot = new vecs.SVGRoot(500, 500)
    this._svgRoot.setViewBox("0 0 1000 1000")
    this._svgRoot.setPreserveAspectRatio("xMinYMin")
    this._svgRoot.observeTouchGesture(this._updateCenterPointFromEvent.bind(this))

    this._rayOriginationPoint = this._svgRoot.createPoint(500, 500)
    this._colors = ["red", "yellow"]
    this._rayCount = 26
    this._rayElements = []
    this._needsRedraw = true
}

CrepuscularRays.prototype._updateCenterPointFromEvent = function (e) {
    this.setRayOriginationPoint(e.positionRelativeToViewport())
}

CrepuscularRays.prototype.svgRoot = function () {
    return this._svgRoot
}

CrepuscularRays.prototype.setRayOriginationPoint = function (point) {
    this._rayOriginationPoint = point
    this._needsRedraw = true
    this.draw()
}

CrepuscularRays.prototype.setColors = function (colors) {
    this._colors = colors.slice(0)
    this._needsRedraw = true
}

CrepuscularRays.prototype.setRayCount = function (count) {
    this._rayCount = count
    this._needsRedraw = true
}

CrepuscularRays.prototype.draw = function () {
    if (!this._needsRedraw) return

    // Clean up our children elements
    this._rayElements.forEach(function (element) {
        element.removeFromDocument()
    })
    this._rayElements = []

    // Create new children elements
    for (var i = 0; i < this._rayCount; i++) {
        var triangle = new vecs.SVGPolygon()
        this._rayElements.push(triangle)
        this._svgRoot.addAt(triangle, i * 50, i * 50)

        var viewportDimensions = this._svgRoot.viewportDimensions()
          , radius = (Math.max(viewportDimensions.width, viewportDimensions.height) + 2)
          , radians1 = 2 * Math.PI * i / this._rayCount
          , x1 = (viewportDimensions.width  / 2) + (radius * Math.cos(radians1))
          , y1 = (viewportDimensions.height / 2) + (radius * Math.sin(radians1))
          , radians2 = 2 * Math.PI  * (i + 1) / this._rayCount
          , x2 = (viewportDimensions.width  / 2) + (radius * Math.cos(radians2))
          , y2 = (viewportDimensions.height / 2) + (radius * Math.sin(radians2))

        triangle.addPoint(this._rayOriginationPoint.x, this._rayOriginationPoint.y)
        triangle.addPoint(x1, y1)
        triangle.addPoint(x2, y2)

        var color = this._colors[i % this._colors.length]
        triangle.setFillColor(color)
    }

    this._needsRedraw = false
}
