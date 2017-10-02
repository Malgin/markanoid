import ui.ImageView as ImageView;

import .BlockGrid as BlockGrid;

const INITIAL_AMOUNT_OF_LIVES = 3;

exports = Class(function () {
  this.init = function (opts) {

    this._ballsBars = [];
    this._superview = opts.superview;

    for (var i = 0; i < INITIAL_AMOUNT_OF_LIVES; i++) {
      this._ballsBars.push(new ImageView({
        superview: this._superview,
        image: 'resources/images/fireball.png',
        width: 25,
        height: 25,
        x: this._superview.width - BlockGrid.BOUNCABLE_WALLS_WIDTH - 25 - this._ballsBars.length * 25,
        y: 15
      }));
    }
  };

  this.looseABall = function () {

    if (this._ballsBars.length > 0) {
      var ballBar = this._ballsBars.pop();
      ballBar.removeFromSuperview();
    }
  };

  this.anyBallsLeft = function () {
    return this._ballsBars.length > 0;
  };
});
