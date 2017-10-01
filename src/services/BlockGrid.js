import ..models.block.BlockPool as BlockPool;
import ..models.block.Block as Block;

const BOUNCABLE_BORDER_WIDTH = 10;
const DISTANCE_BETWEEN_BLOCKS = 5;
const NUMBER_OF_BLOCKS_IN_ROW = 10;

exports = Class(function () {

  this.init = function (opts) {

    this.superview = opts.superview;
    this.levelLayout = opts.layout;

    this._blockPool = new BlockPool();
    this._blockGrid = [];
    this.blockCount = 0;

    this.build();
  };

  this.build = function () {

    // iterate over layout levels
    for (var row = 0; row < this.levelLayout.length; row++) {

      this._blockGrid[row] = [];
      var levelRow = this.levelLayout[row];

      if (levelRow.length > NUMBER_OF_BLOCKS_IN_ROW) levelRow.splice(NUMBER_OF_BLOCKS_IN_ROW, levelRow.length - NUMBER_OF_BLOCKS_IN_ROW);

      for (var col = 0; col < levelRow.length; col++) {

        var blockColor = levelRow[col];

        if (blockColor !== null) {
          var blockView = this._obtainView();

          if (col === 0) {
            var xPosition = BOUNCABLE_BORDER_WIDTH + Block.BLOCK_WIDTH * this._blockGrid[row].length;
          } else {
            var xPosition = BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid[row].length) + Block.BLOCK_WIDTH * this._blockGrid[row].length;
          }
          var yPosition = BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid.length + 1) + Block.BLOCK_HEIGHT * this._blockGrid.length;

          blockView.updateOpts({
            superview: this.superview,
            x: xPosition,
            y: yPosition,
            backgroundColor: '#fff', // TODO: make based config value
            visible: true
          });

          this._blockGrid[row][col] = blockView;
          this.blockCount += 1;
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
      this.blockCount -= 1;
    }));

    return view;
  }
});
