import ui.ImageView as ImageView

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    opts = merge(opts, {
      width: exports.PADDLE_WIDTH,
      height: exports.PADDLE_HEIGHT,
      canHandleEvents: false,
      backgroundColor: '#fff'
    });

    supr(this, 'init', [opts]);
  }
});

// "Class constants. I miss ES6."
exports.PADDLE_WIDTH = 100;
exports.PADDLE_HEIGHT = 15;
exports.PADDLE_BOTTOM_PADDING = 50;
