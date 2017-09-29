import device;

import ui.ImageView as ImageView;

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const PADDLE_BOTTOM_PADDING = 50;

const BALL_RADIUS = 15;

exports = Class(ImageView, function(supr) {

  this.init = function(opts) {

    opts = merge(opts, {
      image: 'resources/images/space_pixel_background.png'
    });

    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {

    this.width = device.width / device.devicePixelRatio;
    this.height = device.height / device.devicePixelRatio;

    this.initialPaddleX = (this.width / 2) - (PADDLE_WIDTH / 2);
    this.initialPaddleY = (this.height) - PADDLE_BOTTOM_PADDING - (PADDLE_HEIGHT / 2);

    this._playerPaddle = new ImageView({
      superview: this,
      x: this.initialPaddleX,
      y: this.initialPaddleY,
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

    // spawn a ball
    this._ball = new ImageView({
      superview: this,
      image: 'resources/images/fireball.png',
      x: this.initialPaddleX + (PADDLE_WIDTH / 2) - BALL_RADIUS,
      y: this.initialPaddleY - (BALL_RADIUS * 2),
      width: BALL_RADIUS * 2,
      height: BALL_RADIUS * 2
    });

    console.log('test');

    // TODO build blocks layers
  };
});
