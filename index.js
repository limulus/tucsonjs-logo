"use strict";

var vecs = require("./vecs");
var CrepuscularRays = require("./CrepuscularRays.js");

module.exports = function (svgRoot) {
  var root = vecs.SVGRoot.instanceFromRawElement(svgRoot);
  var cp = new CrepuscularRays(root);
  cp.draw();
  
  var ms = new MountainSilhouette(root);
  ms.draw();
  
  var cactus = new Saguaro(root);
  cactus.draw();
};


var Saguaro = function (svgRoot) {
  this._svgRoot = svgRoot;
  
  this._xPos = 800;
  this._yPos = 350;
  this._trunkWidth = 75;
  this._color = "#758A65";
};

Saguaro.prototype.draw = function () {
  var trunkRadius = this._trunkWidth / 2;
  
  var trunkCap = new vecs.SVGCircle(trunkRadius);
  trunkCap.setFillColor(this._color);
  this._svgRoot.addAt(trunkCap, this._xPos, this._yPos);
  
  var trunk = new vecs.SVGRect(this._trunkWidth, 1000);
  trunk.setFillColor(this._color)
  this._svgRoot.addAt(trunk, this._xPos - trunkRadius, this._yPos);
};


var MountainSilhouette = function (svgRoot) {
  this._svgRoot = svgRoot;
  
  this._peaks = 3;
  this._peakMax = 560;
  this._valleyMin = 640;
  this._color = "#222222";
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