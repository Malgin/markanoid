import math.geom.Point as Point;

import ui.ImageView as ImageView;

import .Paddle;

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    this.moving = false;
    this.velocity = opts.velocity || new Point(5, 10);

    opts = merge(opts, {
      image: 'resources/images/fireball.png',
      width: exports.BALL_RADIUS * 2,
      height: exports.BALL_RADIUS * 2
    });

    supr(this, 'init', [opts]);
  };

  this.tick = function (dt) {

    if (this.moving) {
      this.style.x += this.velocity.x * (dt / 1000);
      this.style.y += this.velocity.y * (dt / 1000);
    }
  };

});

exports.BALL_RADIUS = 15;
