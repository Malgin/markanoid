import ..models.Scores as Scores;

exports = Class(function () {
  this.init = function (opts) {
    // init score view
    this._scores = 0;

    this._scoresView = new Scores({
      superview: opts.superview
    });
    this._scoresView.setScore(this._scores);
  };

  this.addScoresForBlock = function (block = null) {
    if (block === null) return;

    this._scores += block.getScore();
    this._scoresView.setScore(this._scores);
  };

  this.getTotalScore = function () {
    return this._scores;
  };

  this.resetScores = function () {
    this._scores = 0;
    this._scoresView.setScore(0);
  }
});
