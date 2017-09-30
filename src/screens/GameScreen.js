import device;

import math.geom.Point as Point;

import ui.ImageView as ImageView;

import ..models.Paddle as Paddle;
import ..models.Ball as Ball;

const BOUNCABLE_BORDER_WIDTH = 10;
const NUMBER_OF_BOUNCES_BEFORE_VELOCITY_INCREASE = 10;
const MAX_BALL_X_ABS_VELOCITY = 15;
const MAX_BALL_Y_ABS_VELOCITY = 20;

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

    // TODO build blocks layers
  };

  this.tick = function (dt) {

    // make ball bounce off field edges
    if (this._ball.moving) {
      if (this._ball.style.x >= this.width - (Ball.BALL_RADIUS * 2 + BOUNCABLE_BORDER_WIDTH) || this._ball.style.x <= BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.x = -1 * this._ball.velocity.x; // bounce off walls
        this._increaseSpeedIfNeeded();
      }

      if (this._ball.style.y <= BOUNCABLE_BORDER_WIDTH ||
          this._ballCollidesWithPaddle() ||
          this._ball.style.y >= this.height - BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.y = -1 * this._ball.velocity.y; // bounce off ceiling or paddle
        this._increaseSpeedIfNeeded();
      }

      // TODO make ball appear on other side of an edge
    }

  };

  this._ballCollidesWithPaddle = function () {
    var ballPosition = {
      x: this._ball.style.x,
      y: this._ball.style.y
    };

    var paddlePosition = {
      x: this._playerPaddle.style.x,
      y: this._playerPaddle.style.y
    };

    var intersectsPaddleVertically = ballPosition.y + Ball.BALL_RADIUS * 2 > paddlePosition.y && ballPosition.y + Ball.BALL_RADIUS * 2 <= paddlePosition.y + 4; // TODO fix magic number
    var intersectsPaddleHorizontally = ballPosition.x >= (paddlePosition.x - Ball.BALL_RADIUS) && ballPosition.x <= (paddlePosition.x + Paddle.PADDLE_WIDTH - Ball.BALL_RADIUS);

    return this._ball.moving && intersectsPaddleVertically && intersectsPaddleHorizontally;
  }

  this._increaseSpeedIfNeeded = function() {
    if (this.bounceCounter++ > NUMBER_OF_BOUNCES_BEFORE_VELOCITY_INCREASE) {
      if (Math.abs(this._ball.velocity.x) < MAX_BALL_X_ABS_VELOCITY) {
        this._ball.velocity.x = Math.sign(this._ball.velocity.x) * (Math.abs(this._ball.velocity.x) + 1);
      }
      if (Math.abs(this._ball.velocity.y) < MAX_BALL_Y_ABS_VELOCITY) {
        this._ball.velocity.y = Math.sign(this._ball.velocity.y) * (Math.abs(this._ball.velocity.y) + 1);
      }
      this.bounceCounter = 0;
    }
  }
});
