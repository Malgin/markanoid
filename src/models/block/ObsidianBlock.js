import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'obsidian';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#2f4f4f',
      hitsToDestroy: 10
    });

    supr(this, 'init', [opts]);
  };
});
