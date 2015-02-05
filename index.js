var vecs = require("vecs");

module.exports = function (svgRoot) {
  var silhouetteColor = "black";
  var rayColors = ["#F7941E", "#f7df1e"];
  var textColor = "#C00";

  var root = vecs.SVGRoot.instanceFromRawElement(svgRoot);
  root.setViewBox("0 0 1000 1000");
  root.setPreserveAspectRatio("xMinYMin");
  
  var clippedDrawingArea = new vecs.SVGGroup();
  root.add(clippedDrawingArea);

  var cp = new CrepuscularRays(clippedDrawingArea, rayColors);
  cp.draw();

  var cactus = new Saguaro(clippedDrawingArea, silhouetteColor);
  cactus.draw();

  var ms = new MountainSilhouette(clippedDrawingArea, silhouetteColor);
  ms.draw();

  var logotext = new TucsonJSText(clippedDrawingArea, [textColor, textColor]);
  logotext.draw();
};


var Saguaro = function (svgRoot, color) {
  this._svgRoot = svgRoot;

  this._xPos = 250;
  this._yPos = 150;
  this._armOffsetFromTop = 300;
  this._trunkWidth = 68;
  this._armWidth = this._trunkWidth - 8;
  this._color = color;
};

Saguaro.prototype.draw = function () {
  var trunk = new vecs.SVGPath();
  trunk.addLineSegment(0, 1000);
  trunk.setFillColor("transparent");
  trunk.setStrokeWidth(this._trunkWidth);
  trunk.setStrokeColor(this._color);
  trunk.setStrokeLinecap("round");
  trunk.preventClose();
  this._svgRoot.addAt(trunk, this._xPos, this._yPos);

  var leftArm = this._createArm(false, 180);
  var armYOffset = this._yPos + this._armOffsetFromTop;
  this._svgRoot.addAt(leftArm, this._xPos, armYOffset);

  var rightArm = this._createArm(true, 200);
  this._svgRoot.addAt(rightArm, this._xPos, armYOffset + 35);
};

Saguaro.prototype._createArm = function (flip, armHeight) {
  var armRadius = this._armWidth / 2;
  var armHorizontalGrowth = 135;
  var flipTrigger = flip ? -1 : 1;

  var arm = new vecs.SVGPath();
  arm.addQuadraticBezierCurve(
    armRadius*flipTrigger - armHorizontalGrowth*flipTrigger, 60,
    armRadius*flipTrigger - armHorizontalGrowth*flipTrigger, 0 - armHeight
  );
  arm.addLineSegment(0, -30);
  arm.setFillColor("transparent");
  arm.setStrokeWidth(this._armWidth);
  arm.setStrokeColor(this._color);
  arm.setStrokeLinecap("round");
  arm.preventClose();

  return arm;
};


var MountainSilhouette = function (svgRoot, color) {
  this._svgRoot = svgRoot;

  this._peaks = 3;
  this._peakMax = 600;
  this._valleyMin = 680;
  this._color = color;
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


var CrepuscularRays = function (svg, colors) {
  this._svgRoot = svg;
  // this._svgRoot.observeTouchGesture(this._updateCenterPointFromEvent.bind(this));

  this._rayOriginationPoint = this._svgRoot.createPoint(500, 1060);
  this._colors = colors.reverse();
  this._rayCount = 22;
  this._overdraw = 0.5;
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
      , radians2 = (2 * Math.PI  * (i + 1) + this._overdraw) / this._rayCount
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

var TucsonJSText = function (svg, colors) {
  this._svgRoot = svg;
  this._colors = colors.reverse();
  this._tucson = "M 23.2 22.8 L 23.2 142.2 L 46.2 142.2 L 46.2 22.8 L 69.2 22.8 L 69.2 1.2 L 0.0 1.2 L 0.0 22.8 Z M 115.8 144.6 C 142.6 144.6 151.4 128.0 151.4 89.6 L 151.4 1.2 L 129.4 1.2 L 129.4 91.6 C 129.4 113.6 127.4 123.6 116.0 123.6 C 104.8 123.6 102.8 113.6 102.8 91.6 L 102.8 1.2 L 80.2 1.2 L 80.2 89.6 C 80.2 128.4 88.6 144.6 115.8 144.6 Z M 163.6 71.6 C 163.6 126.0 191.6 143.0 215.2 143.0 C 218.4 143.0 221.6 142.6 224.4 141.8 L 221.8 120.4 C 219.8 120.8 218.0 120.8 216.4 120.8 C 197.0 120.8 186.2 101.0 186.2 72.0 C 186.2 42.6 197.0 23.4 216.4 23.4 C 218.2 23.4 220.0 23.6 221.8 23.8 L 224.4 1.6 C 221.6 1.0 218.4 0.6 215.0 0.6 C 191.6 0.6 163.6 17.2 163.6 71.6 Z M 259.4 143.2 C 281.2 143.2 295.4 132.4 295.4 110.4 C 295.4 79.8 255.6 51.0 255.6 32.6 C 255.6 25.2 260.4 21.8 267.4 21.8 C 272.4 21.8 278.6 23.2 283.2 25.0 L 290.0 5.0 C 286.2 3.0 277.0 0.0 266.6 0.0 C 250.4 0.0 233.0 7.4 233.0 32.6 C 233.0 63.2 272.6 90.8 272.6 110.4 C 272.6 117.8 268.0 122.6 259.0 122.6 C 250.8 122.6 241.4 119.2 236.8 116.8 L 229.4 135.8 C 236.4 139.6 247.2 143.2 259.4 143.2 Z M 343.6 143.4 C 367.0 143.4 382.6 121.8 382.6 71.8 C 382.6 21.4 367.0 0.0 343.6 0.0 C 320.0 0.0 304.2 21.6 304.2 71.8 C 304.2 122.0 320.0 143.4 343.6 143.4 Z M 343.6 122.0 C 331.2 122.0 327.0 99.4 327.0 72.0 C 327.0 44.4 331.2 22.6 343.6 22.6 C 356.0 22.6 360.0 44.4 360.0 72.0 C 360.0 99.6 356.0 122.0 343.6 122.0 Z M 459.4 142.4 L 468.8 142.4 L 468.8 1.2 L 448.4 1.2 L 448.4 75.6 L 408.4 1.0 L 397.2 1.0 L 397.2 142.2 L 417.4 142.2 L 417.4 62.2 Z";
  this._js = "M 21.0 143.6 C 40.2 143.6 61.0 138.2 61.0 101.4 L 61.0 1.4 L 30.6 1.4 L 30.6 97.2 C 30.6 111.6 27.0 115.4 15.8 115.4 C 12.4 115.4 8.2 114.8 3.0 113.8 L 0.0 141.2 C 6.4 142.6 14.2 143.6 21.0 143.6 Z M 116.2 143.6 C 149.6 143.6 165.0 129.6 165.0 104.8 C 165.0 83.0 147.0 70.4 131.6 60.0 C 120.2 52.4 110.0 46.0 110.0 38.0 C 110.0 31.6 114.6 28.2 124.0 28.2 C 133.2 28.2 143.0 30.0 150.2 32.4 L 158.8 5.6 C 154.0 3.2 141.2 0.0 125.4 0.0 C 100.8 0.0 79.8 9.2 79.8 38.6 C 79.8 61.0 98.0 73.6 113.4 83.8 C 124.8 91.4 134.6 97.6 134.6 105.4 C 134.6 113.4 129.0 116.6 118.6 116.6 C 105.0 116.6 91.6 112.6 84.6 109.6 L 75.6 135.2 C 84.8 139.8 99.6 143.6 116.2 143.6 Z";
};

TucsonJSText.prototype.draw = function (colors) {
  var zoomedViewBox = "0 0 700 700";
  var yVal = 740;
  var tucsonContainer = TucsonJSText.textContainerForPath(this._tucson, this._colors[1]);
  this._svgRoot.addAt(tucsonContainer, 35, yVal);
  tucsonContainer.setViewBox(zoomedViewBox);
  var jsContainer = TucsonJSText.textContainerForPath(this._js, this._colors[1]);
  jsContainer.setViewBox(zoomedViewBox);
  this._svgRoot.addAt(jsContainer, 725, yVal);
};

TucsonJSText.textContainerForPath = function (pathCommandString, fillColor) {
  var container = new vecs.SVGRoot(1000, 1000);
  var textPath = new vecs.SVGPath();
  textPath.addRawCommandString(pathCommandString);
  textPath.setFillColor(fillColor);
  container.addAt(textPath, 0, 0);
  return container;
};
