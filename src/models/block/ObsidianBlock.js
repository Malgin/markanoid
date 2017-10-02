import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'obsidian';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#2f4f4f',
      hitPoints: 10,
      scoresForDestroying: 50
    });

    supr(this, 'init', [opts]);
  };
});
