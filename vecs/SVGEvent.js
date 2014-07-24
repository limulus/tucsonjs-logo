"use strict"

var SVGEvent = module.exports = function (e) {
    this.type = e.type
    this._eventObj = e
}

SVGEvent.prototype.rawEventObj = function () {
    return this._eventObj
}

SVGEvent.prototype.positionRelativeToViewport = function () {
    var svgViewportElement = this.viewportElementForTarget()
      , point = svgViewportElement.createSVGPoint()
      , svgCTM = svgViewportElement.getScreenCTM()

    point.x = this.rawEventObj().clientX
    point.y = this.rawEventObj().clientY

    return point.matrixTransform(svgCTM.inverse())
}

SVGEvent.prototype.viewportElementForTarget = function () {
    var parentViewportElement = this.rawEventObj().target.viewportElement

    if (parentViewportElement) {
        return parentViewportElement
    }
    else {
        // If there was no parent viewport element, it must be the target.
        return this.rawEventObj().target
    }
}
