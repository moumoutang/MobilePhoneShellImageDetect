# 使用node-opencv检测手机壳数据

只能说。。人被逼急了，就会开动脑筋解决问题了

背景是这样的：
为了释放生产力，解决这里需要人手工测量的问题

比如：
![avatar](/files/test.jpg)
这是一张带手机壳的图片，那么怎么测量出它的一些数值呢，比如占背景的宽度/圆角/高度/宽度/孔的位置呢

想起了好久没用的opencv，但是当年还写的是C++，后来发现居然有node-opencv 

这是官方地址：git@github.com:peterbraden/node-opencv.git

```bash
  // 环境安装
  brew tap homebrew/science
  brew install opencv@2
  brew link --force opencv@2
  
  //自己项目里
  npm install opencv
```
第一步读取图片：
```javascript
cv.readImage('./files/test.jpg', function(err, im) {
  if (err) throw err;
  let template = {}
  width = im.width()
  height = im.height()
  ....
```
第二步转变为灰度图像，canny算法进行边缘检测：
canny是个（古老）的算法，基本上也是图像处理的入门算法了，可惜我一个前端早就忘得差不多了
```javascript
  im.convertGrayscale()
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);
```
第三部提取边缘数据：
```javascript
  //这里是个数组，投机的取了最大面积的轮廓和最小面积的，全当大轮廓和手机的孔
  contours = im_canny.findContours()
```
其实
其实每个

