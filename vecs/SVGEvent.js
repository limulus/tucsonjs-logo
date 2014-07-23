"use strict"

var SVGEvent = module.exports = function (e) {
    this.type = e.type
    this._eventObj = e
}

SVGEvent.prototype.rawEventObj = function () {
    return this._eventObj
}

SVGEvent.prototype.positionRelativeToViewport = function () {
    var svgViewportElement = this.rawEventObj().target.viewportElement || this.rawEventObj().target
      , point = svgViewportElement.createSVGPoint()
      , svgCTM = svgViewportElement.getScreenCTM()
      , svgViewportBoundingBox = svgViewportElement.getBoundingClientRect()
      , svgViewportOffsetX = svgViewportBoundingBox.left
      , svgViewportOffsetY = svgViewportBoundingBox.top
      , clientX = this.rawEventObj().clientX - svgViewportOffsetX
      , clientY = this.rawEventObj().clientY - svgViewportOffsetY

    point.x = clientX
    point.y = clientY

    return point.matrixTransform(svgCTM.inverse())
}
