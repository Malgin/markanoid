import device;

import ui.ImageView as ImageView;

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const PADDLE_BOTTOM_PADDING = 50;

exports = Class(ImageView, function(supr) {

  this.init = function(opts) {

    this.width = device.width / device.devicePixelRatio;
    this.height = device.height / device.devicePixelRatio;

    opts = merge(opts, {
      image: 'resources/images/space_pixel_background.png'
    });

    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {
    // build a player paddle
    this._playerPaddle = new ImageView({
      superview: this,
      x: (this.width / 2) - (PADDLE_WIDTH / 2),
      y: (this.height) - PADDLE_BOTTOM_PADDING - (PADDLE_HEIGHT / 2),
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      backgroundColor: '#fff'
    });

    console.log('test');

    // TODO build blocks layers
  };
});
