import ..models.Scores as Scores;

exports = Class(function () {
  this.init = function (opts) {
    // init score view
    this._scoresForDestroying = 0;

    this._scores = new Scores({
      superview: opts.superview
    });
    this._scores.setScore(this._scoresForDestroying);
  };

  this.addScoresForBlock = function (block = null) {
    if (block === null) return;

    this._scoresForDestroying += block.getScore();
    this._scores.setScore(this._scoresForDestroying);
  }
});
