import device;

import math.geom.Point as Point;
import math.geom.intersect as intersect;

import ui.ImageView as ImageView;

import ..models.Paddle as Paddle;
import ..models.Ball as Ball;

import ..services.BlockGrid as BlockGrid;

const BOUNCABLE_BORDER_WIDTH = 10;

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

    this.initialPaddleX = (this.width / 2) - (Paddle.PADDLE_WIDTH / 2);
    this.initialPaddleY = (this.height) - Paddle.PADDLE_BOTTOM_PADDING - (Paddle.PADDLE_HEIGHT / 2);

    this.bounceCounter = 0;

    this._playerPaddle = new Paddle({
      superview: this,
      x: this.initialPaddleX,
      y: this.initialPaddleY
    });

    this._ball = new Ball({
      superview: this,
      x: this.initialPaddleX + (Paddle.PADDLE_WIDTH / 2) - Ball.BALL_RADIUS,
      y: this.initialPaddleY - (Ball.BALL_RADIUS * 2),
      velocity: new Point(5, -8)
    });

    this.on('InputMove', bind(this, function (event, point) {

      if (point.x > (Paddle.PADDLE_WIDTH / 2) && point.x < (this.width - Paddle.PADDLE_WIDTH / 2)) {
        this._playerPaddle.style.x = point.x - (Paddle.PADDLE_WIDTH / 2);
      }

      if (!this._ball.moving) {
        this._ball.style.x = this._playerPaddle.style.x + (Paddle.PADDLE_WIDTH / 2) - Ball.BALL_RADIUS;
      }
    }));

    this.on('InputStart', bind(this, function () {
      if (!this._ball.moving) this._ball.moving = true;
    }));

    // build blocks layers
    this._blockGrid = new BlockGrid({
      superview: this,
      level: 1
    });
  };

  this.tick = function (dt) {

    // make ball bounce off field edges
    if (this._ball.moving) {
      if (this._ball.style.x >= this.width - (Ball.BALL_RADIUS * 2 + BOUNCABLE_BORDER_WIDTH) || this._ball.style.x <= BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.x = -1 * this._ball.velocity.x; // bounce off walls
        this._ball.increaseSpeedIfNeeded();
      }

      if (this._ball.style.y <= BOUNCABLE_BORDER_WIDTH ||
          intersect.circleAndRect(this._ball.getCollisionCircle(), this._playerPaddle.getCollisionBox()) ||
          this._ball.style.y >= this.height - BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.y = -1 * this._ball.velocity.y; // bounce off ceiling or paddle
        this._ball.increaseSpeedIfNeeded();
      }

      // TODO make ball appear on other side of an edge
    }
  };
});
