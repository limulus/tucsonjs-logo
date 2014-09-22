"use strict"

var vecs = require("./vecs");
var CrepuscularRays = require("./CrepuscularRays.js");

module.exports = function (svg) {
  var root = vecs.SVGRoot.instanceFromRawElement(svg)
  var cp = new CrepuscularRays(root)
  cp.draw()
}

