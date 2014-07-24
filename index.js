"use strict"

var vecs = require("./vecs")

window.addEventListener("DOMContentLoaded", function () {
    var rect = new vecs.SVGRect(100, 100)
    rect.setStrokeColor("black")
    rect.setStrokeWidth(3)

    var svgRoot = new vecs.SVGRoot(400, 400)
    svgRoot.addAt(rect, 100, 100)
    svgRoot.addToDocumentBodyWithId("logo")

    svgRoot.observe("click", function (e) {
        rect.setCoords(e.positionRelativeToViewport())
    })
}, false)

