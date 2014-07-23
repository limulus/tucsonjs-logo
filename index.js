"use strict"

var vecs = require("./vecs/index.js")

window.addEventListener("DOMContentLoaded", function () {
    var rect = new vecs.SVGRect(100, 100)
    rect.setStrokeColor("black")
    rect.setStrokeWidth(3)

    var svgRoot = new vecs.SVGRoot(400, 400)
    svgRoot.addAt(rect, 100, 100)
    svgRoot.addToDocumentBodyWithId("logo")
    svgRoot.setPreserveAspectRatio("none")
    svgRoot.setViewBox("0 0 1500 1500")

    svgRoot.observe("click", function (e) {
        // rect.setCoords(e.position.x, e.position.y)
        console.log("click!", e.positionRelativeToViewport(), e.rawEventObj())
    })
}, false)

