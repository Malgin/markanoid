import math.geom.Rect as Rectangle;
import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    this.collisionBox = new Rectangle();

    opts = merge(opts, {
      width: exports.BLOCK_WIDTH,
      height: exports.BLOCK_HEIGHT,
      canHandleEvents: false
    });

    supr(this, 'init', [opts]);
  };

  this.getCollisionBox = function () {

    this.collisionBox.x = this.style.x;
    this.collisionBox.y = this.style.y;
    this.collisionBox.width = this.style.width;
    this.collisionBox.height = this.style.height;

    return this.collisionBox;
  }
});

exports.BLOCK_WIDTH = 51;
exports.BLOCK_HEIGHT = 20;
