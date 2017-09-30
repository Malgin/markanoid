import ..models.block.BlockPool as BlockPool;
import ..models.block.Block as Block;

const BOUNCABLE_BORDER_WIDTH = 10;
const DISTANCE_BETWEEN_BLOCKS = 5;

exports = Class(function () {

  this.init = function (opts) {

    this.superview = opts.superview;
    this.currentLevelLayout = JSON.parse(CACHE[`resources/levels/${opts.level}.json`]);

    this._blockPool = new BlockPool();
    this._blockGrid = [];

    this.build();
  };

  this.build = function () {

    // iterate over layout levels
    for (var row = 0; row < this.currentLevelLayout.levelLayout.length; row++) {

      this._blockGrid[row] = [];
      var levelRow = this.currentLevelLayout.levelLayout[row];

      for (var col = 0; col < levelRow.length; col++) {

        var blockColor = levelRow[col];

        if (blockColor !== null) {
          var blockView = this._obtainView();

          blockView.updateOpts({
            superview: this.superview,
            x: BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid[row].length + 1) + Block.BLOCK_WIDTH * this._blockGrid[row].length,
            y: BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid.length + 1) + Block.BLOCK_HEIGHT * this._blockGrid.length,
            backgroundColor: '#fff', // TODO: make based config value
            visible: true
          });

          this._blockGrid[row][col] = blockView;
        } else {
          this._blockGrid[row][col] = null;
        }
      }
    }
  };

  this._obtainView = function () {
    var view = this._blockPool.obtainView();

    view.on('ViewRemoved', bind(this, function () {
      this._blockPool.releaseView(view);
    }));

    return view;
  }
});
