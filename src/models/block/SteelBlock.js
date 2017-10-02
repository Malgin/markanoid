import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'steel';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#d3d3d3',
      hitPoints: 10000
    });

    supr(this, 'init', [opts]);
  };
});
