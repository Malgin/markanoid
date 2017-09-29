import ui.ImageView as ImageView;

import .Paddle;

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    opts = merge(opts, {
      image: 'resources/images/fireball.png',
      width: exports.BALL_RADIUS * 2,
      height: exports.BALL_RADIUS * 2
    });

    supr(this, 'init', [opts]);
  }

});

exports.BALL_RADIUS = 15;
