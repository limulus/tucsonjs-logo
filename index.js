"use strict";

var vecs = require("./vecs");
var svg = require("svg-builder");
var CrepuscularRays = require("./CrepuscularRays.js");

module.exports = function (svgRoot) {
  var root = vecs.SVGRoot.instanceFromRawElement(svgRoot);
  var cp = new CrepuscularRays(root);
  cp.draw();
  
  var ms = new MountainSilhouette(root);
  ms.draw();
};

var MountainSilhouette = function (svgRoot) {
  // this._svgRoot = vecs.SVGRoot.instanceFromRawElement(svg);
  // this._svgRoot.setViewBox("0 0 1000 1000");
  // this._svgRoot.setPreserveAspectRatio("xMinYMin");
  this._svgRoot = svgRoot;
  
  this._peaks = 5;
  this._peakMax = 600;
  this._valleyMin = 400;
  this._color = "black";
};

MountainSilhouette.prototype.draw = function () {
  var ridges = new vecs.SVGPolygon();
  
  var peaksAndValleysCount = this._peaks * 2;
  for (var i = 0; i <= peaksAndValleysCount; i++) {
    var peak = i % 2 === 0;
    var x = 1000 * i / peaksAndValleysCount;
    var y = peak ? this._peakMax : this._valleyMin;
    ridges.addPoint(x, y);
  }
  ridges.addPoint(1001, 1001);
  ridges.addPoint(-1, 1001);
  
  ridges.setStrokeWidth(1);
  ridges.setStrokeColor(this._color);
  ridges.setFillColor(this._color);
  this._svgRoot.addAt(ridges, 0, 300);
};