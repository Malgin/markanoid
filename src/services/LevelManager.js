import ..services.BlockGrid as BlockGrid;

exports = Class(function () {

  this.init = function (opts) {
    this._superview = opts.superview;
    this._currentLevel = null;
  };

  this.initLevel = function (level = '1') {
    this._currentLevel = JSON.parse(CACHE[`resources/levels/${level}.json`]);

    return new BlockGrid({
      superview: this._superview,
      layout: this._currentLevel.levelLayout
    });
  };

  this.hasNextLevel = function () {
    return this._currentLevel.next !== null;
  };

  this.initNextLevel = function () {
    if (this._currentLevel.next !== null) {
      return this.initLevel(this._currentLevel.next);
    }
  }
});
