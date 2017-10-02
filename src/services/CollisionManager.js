import event.Emitter as EventEmitter;
import math.geom.intersect as intersect;

import ..models.block.BaseBlock as Block;
import ..models.Ball as Ball;
import .BlockGrid as BlockGrid;

exports = Class(EventEmitter, function (supr) {

  this.init = function (opts) {
    this._superview = opts.superview;

    supr(this, 'init', [opts]);
  };

  this.blockCollision = function (ball, levelGrid) {

    for (var row = levelGrid._blockGrid.length - 1; row >= 0; row -= 1) {

      var blockRow = levelGrid._blockGrid[row];

      // TODO: optimize collision: detect collision only if ball near the level of a block, either skip

      for (var col = 0; col < blockRow.length; col += 1) {
        var block = blockRow[col];

        if (block === null) continue;

        if (intersect.circleAndRect(ball.getCollisionCircle(), block.getCollisionBox())) {

          // TODO optimization: don't allow tow consecutive hits to the same block

          block.hit();

          if (block.isDestroyed()) {
            this.emit('collision:blockDestroyed', block);
          }

          // figure out from which direction we had a collision
          if (ball.getCollisionCircle().x >= block.style.x &&
              ball.getCollisionCircle().x <= block.style.x + Block.BLOCK_WIDTH) {

            ball.velocity.y = -1 * ball.velocity.y;
            ball.increaseVelocityIfNeeded();
          } else {

            ball.velocity.x = -1 * ball.velocity.x;
            ball.increaseVelocityIfNeeded();
          }

          return; // stop iterating over blocks, as we've found a collision
        }
      }
    }
  };

  this.wallsAndPaddleCollision = function (ball, playerPaddle) {

    var ballCollisionCircle = ball.getCollisionCircle();
    var paddleCollisionBox = playerPaddle.getCollisionBox();

    // TODO: optimize collision: detect collision only if ball is near the edges

    // make ball bounce off field edges
    if (ball.moving) {
      if ((ball.style.x >= this._superview.width - (Ball.BALL_RADIUS * 2 + BlockGrid.BOUNCABLE_WALLS_WIDTH)) && ball.movingRight() ||
          (ball.style.x <= BlockGrid.BOUNCABLE_WALLS_WIDTH) && ball.movingLeft()) {
        ball.velocity.x = -1 * ball.velocity.x; // bounce off walls
        ball.increaseVelocityIfNeeded();
      }

      if ((ball.style.y <= BlockGrid.BOUNCABLE_CEILING_WIDTH && ball.movingUp()) ||
          (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && ball.movingDown())) {
        ball.velocity.y = -1 * ball.velocity.y; // bounce off ceiling or paddle
        ball.increaseVelocityIfNeeded();
      }

      if (intersect.circleAndRect(ballCollisionCircle, paddleCollisionBox) && ball.movingUp()) {

        if (ball.velocity.x === 0) ball.velocity.x = 3;
        else if (Math.abs(ball.velocity.x) < 3) {
          if (ball.velocity.x < 0) ball.velocity.x = -3;
          else                           ball.velocity.x = 3;
        } else {
          if (ballCollisionCircle.x < paddleCollisionBox.x + (paddleCollisionBox.width / 5)) {

            // hit left edge of a paddle
            console.log(`BEFORE Decrease VELOCITY: X: ${ball.velocity.x } Y: ${ball.velocity.y}`);

            if (ball.movingLeft()) {

              ball.increaseXVelocity(-1 * Math.ceil(Math.abs(ball.velocity.x) / 4));
              ball.increaseYVelocity(-1 * Math.ceil(Math.abs(ball.velocity.y) / 5))
            } else if (ball.movingRight()) {
              ball.velocity.x = -1 * ball.velocity.x;
            }

            console.log(`Decrease VELOCITY: X: ${ball.velocity.x } Y: ${ball.velocity.y}`);
          } else if (ballCollisionCircle.x > paddleCollisionBox.x + paddleCollisionBox.width - (paddleCollisionBox.width / 5)) {

            // hit right edge of a paddle
            console.log(`BEFORE Increase VELOCITY: X: ${ball.velocity.x } Y: ${ball.velocity.y }`);

            if (ball.movingLeft()) {
              ball.velocity.x = -1 * ball.velocity.x;
            } else if (ball.movingRight()) {

              ball.increaseXVelocity(Math.ceil(Math.abs(ball.velocity.x) / 4));
              ball.increaseYVelocity(-1 * Math.ceil(Math.abs(ball.velocity.y) / 5))
            }

            console.log(`Increase VELOCITY: X: ${ball.velocity.x} Y: ${ball.velocity.y }`);
          }
        }
      }

      // TODO make ball appear on other side of an edge
    }
  };
});
