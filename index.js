var vecs = require("./vecs");

module.exports = function (svgRoot) {
  var root = vecs.SVGRoot.instanceFromRawElement(svgRoot);
  root.setViewBox("0 0 1000 1000");
  root.setPreserveAspectRatio("xMinYMin");

  var cp = new CrepuscularRays(root);
  cp.draw();
  
  var ms = new MountainSilhouette(root);
  ms.draw();
  
  var cactus = new Saguaro(root);
  cactus.draw();
};


var Saguaro = function (svgRoot) {
  this._svgRoot = svgRoot;
  
  this._xPos = 750;
  this._yPos = 350;
  this._armOffsetFromTop = 300;
  this._trunkWidth = 60;
  this._color = "#758A65";
};

Saguaro.prototype.draw = function () {
  var trunkRadius = this._trunkWidth / 2;
  
  var trunkCap = new vecs.SVGCircle(trunkRadius);
  trunkCap.setFillColor(this._color);
  this._svgRoot.addAt(trunkCap, this._xPos, this._yPos);
  
  var trunk = new vecs.SVGRect(this._trunkWidth, 1000);
  trunk.setFillColor(this._color);
  this._svgRoot.addAt(trunk, this._xPos - trunkRadius, this._yPos);
  
  var leftArm = this._createArm(false);
  var armYOffset = this._yPos + this._armOffsetFromTop;
  this._svgRoot.addAt(leftArm, this._xPos, armYOffset);
  
  var rightArm = this._createArm(true);
  this._svgRoot.addAt(rightArm, this._xPos, armYOffset + 50);
};

Saguaro.prototype._createArm = function (flip) {
  var trunkRadius = this._trunkWidth / 2;
  var flipTrigger = flip ? -1 : 1;
  
  var armHeight = 200;
  var arm = new vecs.SVGPath();
  arm.addQuadraticBezierCurve(
    trunkRadius*flipTrigger - 150*flipTrigger, 70,
    trunkRadius*flipTrigger - 150*flipTrigger, 0 - armHeight
  );
  arm.addLineSegment(0, -30);
  arm.setFillColor("transparent");
  arm.setStrokeWidth(this._trunkWidth);
  arm.setStrokeColor(this._color);
  arm.setStrokeLinecap("round");
  arm.preventClose();
  
  return arm;
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


var CrepuscularRays = function (svg) {
  this._svgRoot = svg;
  // this._svgRoot.observeTouchGesture(this._updateCenterPointFromEvent.bind(this));

  this._rayOriginationPoint = this._svgRoot.createPoint(500, 1000);
  this._colors = ["red", "yellow"];
  this._rayCount = 26;
  this._rayElements = [];
  this._needsRedraw = true;
};

CrepuscularRays.prototype._updateCenterPointFromEvent = function (e) {
  this.setRayOriginationPoint(e.positionRelativeToViewport());
};

CrepuscularRays.prototype.svgRoot = function () {
  return this._svgRoot;
};

CrepuscularRays.prototype.setRayOriginationPoint = function (point) {
  this._rayOriginationPoint = point;
  this._needsRedraw = true;
  this.draw();
};

CrepuscularRays.prototype.setColors = function (colors) {
  this._colors = colors.slice(0);
  this._needsRedraw = true;
};

CrepuscularRays.prototype.setRayCount = function (count) {
  this._rayCount = count;
  this._needsRedraw = true;
};

CrepuscularRays.prototype.draw = function () {
  if (!this._needsRedraw) return;

  // Clean up our children elements
  this._rayElements.forEach(function (element) {
    element.removeFromDocument();
  });
  this._rayElements = [];

  // Create new children elements
  for (var i = 0; i < this._rayCount; i++) {
    var triangle = new vecs.SVGPolygon();
    this._rayElements.push(triangle);
    this._svgRoot.addAt(triangle, i * 50, i * 50);

    var viewportDimensions = this._svgRoot.viewportDimensions()
      , radius = (Math.max(viewportDimensions.width, viewportDimensions.height) + 2)
      , radians1 = 2 * Math.PI * i / this._rayCount
      , x1 = (viewportDimensions.width  / 2) + (radius * Math.cos(radians1))
      , y1 = (viewportDimensions.height / 2) + (radius * Math.sin(radians1))
      , radians2 = 2 * Math.PI  * (i + 1) / this._rayCount
      , x2 = (viewportDimensions.width  / 2) + (radius * Math.cos(radians2))
      , y2 = (viewportDimensions.height / 2) + (radius * Math.sin(radians2));

    triangle.addPoint(this._rayOriginationPoint.x, this._rayOriginationPoint.y);
    triangle.addPoint(x1, y1);
    triangle.addPoint(x2, y2);

    var color = this._colors[i % this._colors.length];
    triangle.setFillColor(color);
  }

  this._needsRedraw = false;
};