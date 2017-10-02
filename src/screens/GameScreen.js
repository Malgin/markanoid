import device;

import math.geom.Point as Point;
import math.geom.intersect as intersect;

import ui.ImageView as ImageView;
import ui.TextView as TextView;

import ..models.Paddle as Paddle;
import ..models.Ball as Ball;
import ..models.block.BaseBlock as Block;

import ..services.BlockGrid as BlockGrid;
import ..services.LevelManager as LevelManager;
import ..services.ScoresManager as ScoresManager;
import ..services.LivesManager as LivesManager;
import ..services.CollisionManager as CollisionManager;

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

    this._levelManager = new LevelManager({
      superview: this
    });

    this._scoresManager = new ScoresManager({
      superview: this
    });

    this._livesManager = new LivesManager({
      superview: this
    });

    this._endGameScreen = new TextView({
      superview: this,
      width: this.width / 2,
      height: 150,
      autoFontSize: true,
      x: this.width / 4,
      y: this.height / 3,
      verticalAlign: 'middle',
      horizontalAlign: 'left',
      wrap: false,
      multiline: true,
      color: '#fff'
    });

    this._endGameScreen.hide();

    this._collisionManager = new CollisionManager({
      superview: this
    });
    this._collisionManager.on('collision:blockDestroyed', bind(this, function (block) {

      this._scoresManager.addScoresForBlock(block);
      this._blockGrid.destroyBlock(block);

      if (!this._blockGrid.anyDestructibleBlocksLeft()) {
        if (this._levelManager.hasNextLevel()) {

          this._ball.resetPosition();
          this._playerPaddle.resetPosition();

          this._blockGrid = this._levelManager.initNextLevel();
        } else {
          // win the game, back to menu
          this._winTheGame();
        }
      }
    }));

    this.on('InputMove', bind(this, function (event, point) {

      if (this.gameIsOn) {

        if (point.x > (Paddle.PADDLE_WIDTH / 2) && point.x < (this.width - Paddle.PADDLE_WIDTH / 2)) {
          this._playerPaddle.style.x = point.x - (Paddle.PADDLE_WIDTH / 2);
        }

        if (!this._ball.moving) {
          this._ball.style.x = this._playerPaddle.style.x + (Paddle.PADDLE_WIDTH * 2 / 3) - Ball.BALL_RADIUS;
        }
      }
    }));

    this.on('InputStart', bind(this, function () {
      if (!this._ball.moving) this._ball.moving = true;
      if (!this.gameIsOn) this.emit('game:end');
    }));

    this.on('game:reset', bind(this, function () {
      this._endGameScreen.hide();
      this._ball.resetPosition();
      this._playerPaddle.resetPosition();
      this._livesManager.resetLives();
      this._scoresManager.resetScores();
      this._blockGrid = this._levelManager.initLevel('4');

      this.gameIsOn = true;
    }));
  };

  this.tick = function () {

    if (!this.gameIsOn) return;

    if (!this._lostTheBall()) {

      this._collisionManager.blockCollision(this._ball, this._blockGrid);
      this._collisionManager.wallsAndPaddleCollision(this._ball, this._playerPaddle);
    } else {

      this._livesManager.looseABall();

      if (this._livesManager.anyBallsLeft()) {
        this._ball.resetPosition(this._playerPaddle);
      } else {
        this._looseTheGame();
      }
    }
  };

  this._winTheGame = function () {
    this._endGameScreen.setText(`You won! \n Score: ${this._scoresManager.getTotalScore()}`);
    this._endGameScreen.show();
    this.gameIsOn = false;
  };

  this._looseTheGame = function () {
    this._endGameScreen.setText(`You LOOSE!\n Score: ${this._scoresManager.getTotalScore()}`);
    this._endGameScreen.show();
    this.gameIsOn = false;
  };

  this._lostTheBall = function () {
    return this._ball.style.y >= this.height;
  };
});
