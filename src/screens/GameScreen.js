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

    this._playerPaddle = new ImageView({
      superview: this,
      x: (this.width / 2) - (PADDLE_WIDTH / 2),
      y: (this.height) - PADDLE_BOTTOM_PADDING - (PADDLE_HEIGHT / 2),
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      canHandleEvents: false,
      backgroundColor: '#fff'
    });

    this.on('InputMove', bind(this, function (event, point) {

      if (point.x > (PADDLE_WIDTH / 2) && point.x < (this.width - PADDLE_WIDTH / 2)) {
        this._playerPaddle.updateOpts({
          x: point.x - (PADDLE_WIDTH / 2)
        });
      }
    }));

    // TODO build blocks layers
  };
});
