import ..models.block.BlockPool as BlockPool;
import ..models.block.BaseBlock as Block;

const DISTANCE_BETWEEN_BLOCKS = 5;
const NUMBER_OF_BLOCKS_IN_ROW = 10;

exports = Class(function () {

  this.init = function (opts) {

    this.superview = opts.superview;
    this.levelLayout = opts.layout;

    this._blockPools = {};
    this._blockGrid = [];
    this._blockCount = 0;
    this._indestructibleBlockCount = 0;

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

          var xPosition = exports.BOUNCABLE_WALLS_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid[row].length) + Block.BLOCK_WIDTH * this._blockGrid[row].length;
          var yPosition = exports.BOUNCABLE_CEILING_WIDTH + DISTANCE_BETWEEN_BLOCKS * (this._blockGrid.length - 1) + Block.BLOCK_HEIGHT * (this._blockGrid.length - 1);

          blockView.updateOpts({
            superview: this.superview,
            x: xPosition,
            y: yPosition,
            visible: true
          });

          blockView.setGridRow(row);
          blockView.setGridCol(col);

          this._blockGrid[row][col] = blockView;
          this._blockCount += 1;

          if (blockType === 'steel') this._indestructibleBlockCount += 1;
        } else {
          this._blockGrid[row][col] = null;
        }
      }
    }
  };

  this.resetGrid = function () {
    for (var row = 0; row < this._blockGrid.length; row++) {
      for (var col = 0; col < this._blockGrid[row].length; col++) {
        var blockView = this._blockGrid[row][col];
        if (blockView !== null) {
          this.destroyBlock(blockView);
        }
      }
    }
  };

  this.destroyBlock = function (block) {
    block.removeFromSuperview();
    this._blockGrid[block.getGridRow()][block.getGridCol()] = null;
    this._blockPools[block.blockType].releaseView(block);
    this._blockCount -= 1;
  };

  this.anyDestructibleBlocksLeft = function () {
    return this._blockCount - this._indestructibleBlockCount;
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

exports.BOUNCABLE_WALLS_WIDTH = 10;
exports.BOUNCABLE_CEILING_WIDTH = 60;
