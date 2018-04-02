// Detects triangles and quadrilaterals
var cv = require('../lib/opencv');

var lowThresh = 50;
var highThresh = 80;
var nIters = 1;
var minArea = 300;

var BLUE  = [255, 0, 0]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var min = 100000, max = 0


cv.readImage('./files/test.jpg', function(err, im) {
  if (err) throw err;
  let template = {}
  width = im.width()
  height = im.height()
  if (width < 1 || height < 1) throw new Error('Image has no size');

  var out = new cv.Matrix(height, width);
  
  im.threshold(0, 100)
  im.save('./tmp/grey.jpg');
  im.convertGrayscale()
  
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  contours = im_canny.findContours('CV_RETR_EXTERNAL');

  // for(var k in contours) {
  //   console.log(contours[k])
  // }

  for (i = 0; i < contours.size(); i++) {

    if (contours.area(i) < minArea) continue

    var arcLength = contours.arcLength(i, true)
    if (contours.area(i) < min) {
      min = i
    }
    if (contours.area(i) > max){
      max = i
    }
  }
  out.drawContour(contours, min, GREEN)
  out.drawContour(contours, max, RED)

  let allPoints = contours.points(max)

  let outter = contours.boundingRect(max)
  let inner =  contours.boundingRect(min)
  
  let xContacts = []
  let yContacts = []

  allPoints.forEach(item => {
    if (item.x == outter.x) {
      xContacts.push(item)
    }
    if (item.y == outter.y) {
      yContacts.push(item)
    }
  })

  function compare(property){
    return function(a,b){
      var value1 = a[property]
      var value2 = b[property]
      return value1 - value2
    }
  }

  xContacts.sort(compare('y'))
  yContacts.sort(compare('x'))

  let xContact = xContacts[0]
  let yContact = yContacts[0]

  template.canvasWidth = (outter.width / width * 100).toFixed(2)
  template.canvasOffsetY = (outter.y / height * 100).toFixed(2)
  template.canvasScale = (outter.height / outter.width).toFixed(2)

  template.canvasRadius = Math.abs(xContact.x - yContact.x) / (width / 750)

  template.covers = []
  let cover = {}
  cover.top = (inner.y / height * 100).toFixed(2)
  cover.left = (inner.x / width * 100).toFixed(2)
  cover.width = (inner.width / width * 100).toFixed(2)
  template.covers.push(cover)

  console.log(template)

  out.save('./tmp/detect-shapes.png');
  console.log('Image saved to ./tmp/detect-shapes.png');
});
