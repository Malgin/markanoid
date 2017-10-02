import math.geom.Rect as Rectangle;
import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    this.collisionBox = new Rectangle();
    this._hitPoints = opts.hitPoints | 1;
    this._scoresForDestroying = opts.scoresForDestroying | 10;

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
  };

  this.hit = function () {
    if (this._hitPoints > 0) this._hitPoints -= 1;
  };

  this.isDestroyed = function () {
    return this._hitPoints === 0;
  };

  this.getScore = function () {
    return this._scoresForDestroying;
  };

  this.setGridRow = function (value) {
    this._gridRow = value;
  };

  this.getGridRow = function () {
    return this._gridRow;
  };

  this.setGridCol = function (value) {
    this._gridCol = value;
  };

  this.getGridCol = function () {
    return this._gridCol;
  };
});

exports.BLOCK_WIDTH = 51;
exports.BLOCK_HEIGHT = 20;
