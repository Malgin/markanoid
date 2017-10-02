import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'asteroid_blue';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#00f',
      scoresForDestroying: 20
    });

    supr(this, 'init', [opts]);
  };
});
