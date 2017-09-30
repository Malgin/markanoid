import math.geom.Point as Point;
import math.geom.Rect as Rectangle;

import ui.ImageView as ImageView

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    this.originalPosition = new Point(opts.x, opts.y);
    this.collisionBox = new Rectangle(opts.x, opts.y, exports.PADDLE_WIDTH, exports.PADDLE_HEIGHT);

    opts = merge(opts, {
      width: exports.PADDLE_WIDTH,
      height: exports.PADDLE_HEIGHT,
      canHandleEvents: false,
      backgroundColor: '#fff'
    });

    supr(this, 'init', [opts]);
  };

  this.getCollisionBox = function () {

    this.collisionBox.x = this.style.x;
    this.collisionBox.y = this.style.y;
    return this.collisionBox;
  };

  this.resetPosition = function () {
    this.updateOpts({
      x: this.originalPosition.x,
      y: this.originalPosition.y
    })
  };
});

// "Class constants. I miss ES6."
exports.PADDLE_WIDTH = 100;
exports.PADDLE_HEIGHT = 15;
exports.PADDLE_BOTTOM_PADDING = 50;
