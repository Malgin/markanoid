import math.geom.Point as Point;
import math.geom.Circle as Circle;

import ui.ImageView as ImageView;

const NUMBER_OF_BOUNCES_BEFORE_VELOCITY_INCREASE = 10;
const MAX_BALL_X_ABS_VELOCITY = 15;
const MAX_BALL_Y_ABS_VELOCITY = 20;

exports = Class(ImageView, function (supr) {

  this.init = function (opts) {

    this.moving = false;
    this.velocity = opts.velocity || new Point(5, 10);
    this.originalVelocity = new Point(this.velocity.x, this.velocity.y);
    this.originalPosition = new Point(opts.x, opts.y);
    this.collisionCircle = new Circle(opts.x + exports.BALL_RADIUS, opts.y + exports.BALL_RADIUS, exports.BALL_RADIUS);
    this.bounceCounter = 0;
    this.previousPosition = new Point();

    opts = merge(opts, {
      image: 'resources/images/fireball.png',
      width: exports.BALL_RADIUS * 2,
      height: exports.BALL_RADIUS * 2
    });

    supr(this, 'init', [opts]);
  };

  this.getCollisionCircle = function () {

    this.collisionCircle.x = this.style.x + exports.BALL_RADIUS;
    this.collisionCircle.y = this.style.y + exports.BALL_RADIUS;
    return this.collisionCircle;
  };

  this.increaseVelocityIfNeeded = function() {

    if (Math.abs(this.velocity.x) >= MAX_BALL_X_ABS_VELOCITY && Math.abs(this.velocity.y) >= MAX_BALL_Y_ABS_VELOCITY) {
      return;
    }

    if (++this.bounceCounter >= NUMBER_OF_BOUNCES_BEFORE_VELOCITY_INCREASE) {
      if (Math.abs(this.velocity.x) < MAX_BALL_X_ABS_VELOCITY) {
        this.velocity.x = Math.sign(this.velocity.x) * (Math.abs(this.velocity.x) + 1);
      }
      if (Math.abs(this.velocity.y) < MAX_BALL_Y_ABS_VELOCITY) {
        this.velocity.y = Math.sign(this.velocity.y) * (Math.abs(this.velocity.y) + 1);
      }
      this.bounceCounter = 0;
    }
  };

  this.increaseXVelocity = function (value) {
    if (Math.abs(this.velocity.x + value) <= MAX_BALL_X_ABS_VELOCITY) {
      this.velocity.x = this.velocity.x + value;
    } else {
      this.velocity.x = Math.sign(this.velocity.x) * MAX_BALL_X_ABS_VELOCITY;
    }
  };

  this.increaseYVelocity = function (value) {
    if (Math.abs(this.velocity.y + value) <= MAX_BALL_Y_ABS_VELOCITY) {
      this.velocity.y = this.velocity.y + value;
    } else {
      this.velocity.y = Math.sign(this.velocity.y) * MAX_BALL_Y_ABS_VELOCITY;
    }
  };

  this.movingRight = function () {
    return this.moving && this.velocity.x > 0;
  };

  this.movingLeft = function () {
    return this.moving && this.velocity.x < 0;
  };

  this.movingDown = function () {
    return this.moving && this.velocity.y > 0;
  };

  this.movingUp = function () {
    return this.moving && this.velocity.y < 0;
  };

  this.resetPosition = function () {
    this.moving = false;
    this.updateOpts({
      x: this.originalPosition.x,
      y: this.originalPosition.y
    });
    this.velocity = this.originalVelocity;
    this.originalVelocity = new Point(this.velocity.x, this.velocity.y);
  };

  this.tick = function (dt) {

    if (this.moving) {
      this.previousPosition.x = this.style.x;
      this.previousPosition.y = this.style.y;

      this.style.x += this.velocity.x;
      this.style.y += this.velocity.y;
    }
  };

});

exports.BALL_RADIUS = 15;
