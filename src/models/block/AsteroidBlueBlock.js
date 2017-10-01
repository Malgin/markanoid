import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'asteroid_blue';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#00f',
      hitsToDestroy: 1
    });

    supr(this, 'init', [opts]);
  };
});
