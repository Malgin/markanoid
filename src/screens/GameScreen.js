import device;

import math.geom.Point as Point;
import math.geom.intersect as intersect;

import ui.ImageView as ImageView;

import ..models.Paddle as Paddle;
import ..models.Ball as Ball;
import ..models.block.BaseBlock as Block;

import ..services.BlockGrid as BlockGrid;
import ..services.LevelManager as LevelManager;
import ..services.ScoresManager as ScoresManager;

exports = Class(ImageView, function(supr) {

  this.init = function(opts) {

    this.gameIsOn = false;

    this.width = opts.width;
    this.height = opts.height;

    opts = merge(opts, {
      image: 'resources/images/space_pixel_background.png'
    });

    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {

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
      velocity: new Point(3, -8)
    });

    this._scoresManager = new ScoresManager({
      superview: this
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

    this.on('game:reset', bind(this, function () {
      this._ball.resetPosition();
      this._playerPaddle.resetPosition();
      this._blockGrid = this._levelManager.initLevel('4');

      this.gameIsOn = true;
    }));
  };

  this.tick = function () {

    if (!this.gameIsOn) return;

    if (!this._lostTheBall()) {
      this._blockCollision();
      this._wallsAndPaddleCollision();
    } else {

      // TODO Releases all viewpools
      this._endTheGame();
    }
  };

  this._endTheGame = function () {
    this.gameIsOn = false;
    this.emit('game:end');
  };

  this._lostTheBall = function () {
    return this._ball.style.y >= this.height;
  };

  this._blockCollision = function () {

    for (var row = this._blockGrid._blockGrid.length - 1; row >= 0; row -= 1) {

      var blockRow = this._blockGrid._blockGrid[row];

      // TODO: optimize collision: detect collision only if ball near the level of a block, either skip

      for (var col = 0; col < blockRow.length; col += 1) {
        var block = blockRow[col];

        if (block === null) continue;

        if (intersect.circleAndRect(this._ball.getCollisionCircle(), block.getCollisionBox())) {

          // TODO optimization: don't allow tow consecutive hits to the same block

          block.hit();

          if (block.isDestroyed()) {
            this._scoresManager.addScoresForBlock(block);

            this._blockGrid.destroyBlock(block);

            this._blockGrid._blockGrid[row][col] = null;



            if (this._blockGrid.blockCount === 0) {
              if (this._levelManager.hasNextLevel()) {

                this._ball.resetPosition();
                this._playerPaddle.resetPosition();

                this._blockGrid = this._levelManager.initNextLevel();
              } else {
                // win the game, back to menu
                this._endTheGame();
              }

              return;
            }
          }

          // figure out from which direction we had a collision
          if (this._ball.getCollisionCircle().x >= block.style.x &&
              this._ball.getCollisionCircle().x <= block.style.x + Block.BLOCK_WIDTH) {

            this._ball.velocity.y = -1 * this._ball.velocity.y;
            this._ball.increaseVelocityIfNeeded();
          } else {

            this._ball.velocity.x = -1 * this._ball.velocity.x;
            this._ball.increaseVelocityIfNeeded();
          }

          return; // stop iterating over blocks, as we've found a collision
        }
      }
    }
  };

  this._wallsAndPaddleCollision = function () {

    var ballCollisionCircle = this._ball.getCollisionCircle();
    var paddleCollisionBox = this._playerPaddle.getCollisionBox();

    // TODO: optimize collision: detect collision only if ball is near the edges

    // make ball bounce off field edges
    if (this._ball.moving) {
      if ((this._ball.style.x >= this.width - (Ball.BALL_RADIUS * 2 + BlockGrid.BOUNCABLE_BORDER_WIDTH)) && this._ball.movingRight() ||
          (this._ball.style.x <= BlockGrid.BOUNCABLE_BORDER_WIDTH) && this._ball.movingLeft()) {
        this._ball.velocity.x = -1 * this._ball.velocity.x; // bounce off walls
        this._ball.increaseVelocityIfNeeded();
      }

      if (this._ball.style.y <= BlockGrid.BOUNCABLE_BORDER_WIDTH ||
          (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && this._ball.movingDown())) {
        this._ball.velocity.y = -1 * this._ball.velocity.y; // bounce off ceiling or paddle
        this._ball.increaseVelocityIfNeeded();
      }

      if (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && this._ball.movingUp()) {

        if (this._ball.velocity.x === 0) this._ball.velocity.x = 3;
        else if (Math.abs(this._ball.velocity.x) < 3) {
          if (this._ball.velocity.x < 0) this._ball.velocity.x = -3;
          else                           this._ball.velocity.x = 3;
        } else {
          if (ballCollisionCircle.x < paddleCollisionBox.x + (paddleCollisionBox.width / 5)) {

            // hit left edge of a paddle
            console.log(`BEFORE Decrease VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y}`);

            if (this._ball.movingLeft()) {

              this._ball.increaseXVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.x) / 4));
              this._ball.increaseYVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            } else if (this._ball.movingRight()) {
              this._ball.velocity.x = -1 * this._ball.velocity.x;
            }

            console.log(`Decrease VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y}`);
          } else if (ballCollisionCircle.x > paddleCollisionBox.x + paddleCollisionBox.width - (paddleCollisionBox.width / 5)) {

            // hit right edge of a paddle
            console.log(`BEFORE Increase VELOCITY: X: ${this._ball.velocity.x } Y: ${this._ball.velocity.y }`);

            if (this._ball.movingLeft()) {
              this._ball.velocity.x = -1 * this._ball.velocity.x;
            } else if (this._ball.movingRight()) {

              this._ball.increaseXVelocity(Math.ceil(Math.abs(this._ball.velocity.x) / 4));
              this._ball.increaseYVelocity(-1 * Math.ceil(Math.abs(this._ball.velocity.y) / 5))
            }

            console.log(`Increase VELOCITY: X: ${this._ball.velocity.x} Y: ${this._ball.velocity.y }`);
          }
        }
      }

      // TODO make ball appear on other side of an edge
    }
  };
});
