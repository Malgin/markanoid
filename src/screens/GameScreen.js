import device;

import math.geom.Point as Point;
import math.geom.intersect as intersect;

import ui.ImageView as ImageView;

import ..models.Paddle as Paddle;
import ..models.Ball as Ball;
import ..models.block.Block as Block;

import ..services.BlockGrid as BlockGrid;
import ..services.LevelManager as LevelManager;

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

    this._playerPaddle = new Paddle({
      superview: this,
      x: this.initialPaddleX,
      y: this.initialPaddleY
    });

    this._ball = new Ball({
      superview: this,
      x: this.initialPaddleX + (Paddle.PADDLE_WIDTH * 2 / 3) - Ball.BALL_RADIUS,
      y: this.initialPaddleY - (Ball.BALL_RADIUS * 2),
      velocity: new Point(5, -8)
    });

    this.on('InputMove', bind(this, function (event, point) {

      if (point.x > (Paddle.PADDLE_WIDTH / 2) && point.x < (this.width - Paddle.PADDLE_WIDTH / 2)) {
        this._playerPaddle.style.x = point.x - (Paddle.PADDLE_WIDTH / 2);
      }

      if (!this._ball.moving) {
        this._ball.style.x = this._playerPaddle.style.x + (Paddle.PADDLE_WIDTH * 2 / 3) - Ball.BALL_RADIUS;
      }
    }));

    this.on('InputStart', bind(this, function () {
      if (!this._ball.moving) this._ball.moving = true;
    }));

    this._levelManager = new LevelManager({
      gridSuperview: this
    });
    this._blockGrid = this._levelManager.initLevel();
  };

  this.tick = function () {

    this._blockCollision();
    this._wallsAndPaddleCollision();
  };

  this._blockCollision = function () {
    for (var row = this._blockGrid._blockGrid.length - 1; row >= 0; row -= 1) {

      var blockRow = this._blockGrid._blockGrid[row];

      for (var col = 0; col < blockRow.length; col += 1) {
        var block = blockRow[col];

        if (block === null) continue;

        if (intersect.circleAndRect(this._ball.getCollisionCircle(), block.getCollisionBox())) {

          block.removeFromSuperview();
          this._blockGrid._blockGrid[row][col] = null;

          // figure out from which direction we had a collision
          if (this._ball.getCollisionCircle().x >= block.style.x &&
              this._ball.getCollisionCircle().x <= block.style.x + Block.BLOCK_WIDTH) {

            this._ball.velocity.y = -1 * this._ball.velocity.y;
            this._ball.increaseVelocityIfNeeded();
          } else {

            this._ball.velocity.x = -1 * this._ball.velocity.x;
            this._ball.increaseVelocityIfNeeded();
          }

          if (this._blockGrid.blockCount === 0) {
            // level complete
            if (this._levelManager.hasNextLevel()) {

              this._ball.moving = false;
              this._ball.resetPosition();
              this._playerPaddle.resetPosition();

              this._blockGrid = this._levelManager.initNextLevel();
            } else {
              // win the game, back to menu
            }
          }

          return; // stop iterating over blocks, as we've found a collision
        }
      }
    }
  };

  this._wallsAndPaddleCollision = function () {

    var ballCollisionCircle = this._ball.getCollisionCircle();
    var paddleCollisionBox = this._playerPaddle.getCollisionBox();

    // make ball bounce off field edges
    if (this._ball.moving) {
      if (this._ball.style.x >= this.width - (Ball.BALL_RADIUS * 2 + BOUNCABLE_BORDER_WIDTH) || this._ball.style.x <= BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.x = -1 * this._ball.velocity.x; // bounce off walls
        this._ball.increaseVelocityIfNeeded();
      }

      if (this._ball.style.y <= BOUNCABLE_BORDER_WIDTH ||
          (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && this._ball.movingDown()) ||
          this._ball.style.y >= this.height - BOUNCABLE_BORDER_WIDTH) {
        this._ball.velocity.y = -1 * this._ball.velocity.y; // bounce off ceiling or paddle
        this._ball.increaseVelocityIfNeeded();
      }

      if (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && this._ball.movingDown()) {

        if (this._ball.velocity.x === 0) this._ball.velocity.x = 3;
        else if (Math.abs(this._ball.velocity.x) < 3) {
          if (this._ball.velocity.x < 0) this._ball.velocity.x = -3;
          else                           this._ball.velocity.x = 3;
        } else {
          if (ballCollisionCircle.x < paddleCollisionBox.x + (paddleCollisionBox.width / 5)) {

            // hit left edge of a paddle
            console.log(`BEFORE Decrease VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y}`);

            this._ball.increaseXVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.x) / 4));

            if (this._ball.movingLeft()) {
              this._ball.increaseYVelocity(Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            } else if (this._ball.movingRight()) {
              this._ball.increaseYVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            }

            console.log(`Decrease VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y}`);
          } else if (ballCollisionCircle.x > paddleCollisionBox.x + paddleCollisionBox.width - (paddleCollisionBox.width / 5)) {

            // hit right edge of a paddle
            console.log(`BEFORE Increase VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y }`);

            this._ball.increaseXVelocity(Math.ceil(Math.abs(this._ball.velocity.x) / 4));

            if (this._ball.movingLeft()) {
              this._ball.increaseYVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            } else if (this._ball.movingRight()) {
              this._ball.increaseYVelocity(Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            }

            console.log(`Increase VELOCITY: X: ${this._ball.velocity.x} Y: ${this._ball.velocity.y }`);
          }
        }
      }

      // TODO make ball appear on other side of an edge
    }
  };
});
