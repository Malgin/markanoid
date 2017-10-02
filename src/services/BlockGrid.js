import ..models.block.BlockPool as BlockPool;
import ..models.block.BaseBlock as Block;

const SCORES_BORDER = 50;
const DISTANCE_BETWEEN_BLOCKS = 5;
const NUMBER_OF_BLOCKS_IN_ROW = 10;

exports = Class(function () {

  this.init = function (opts) {

    this.superview = opts.superview;
    this.levelLayout = opts.layout;

    this._blockPools = {};
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

        var blockType = levelRow[col];

        if (blockType !== null) {
          var blockView = this._obtainView(blockType);

          var xPosition = exports.BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid[row].length) + Block.BLOCK_WIDTH * this._blockGrid[row].length;
          var yPosition = exports.BOUNCABLE_BORDER_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid.length - 1) + Block.BLOCK_HEIGHT * (this._blockGrid.length - 1) + SCORES_BORDER;

          blockView.updateOpts({
            superview: this.superview,
            x: xPosition,
            y: yPosition,
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

  this.destroyBlock = function (block) {
    block.removeFromSuperview();
    this._blockPools[block.blockType].releaseView(block);
    this.blockCount -= 1;
  };

  this._obtainView = function (blockType) {
    if (!this._blockPools[blockType]) {
      this._blockPools[blockType] = new BlockPool({
        blockType: blockType
      });
    }
    var view = this._blockPools[blockType].obtainView();

    return view;
  }
});

exports.BOUNCABLE_BORDER_WIDTH = 10;
