import .BaseBlock as BaseBlock;

exports = Class(BaseBlock, function (supr) {

  this.blockType = 'moon_yellow';

  this.init = function (opts) {

    opts = merge(opts, {
      backgroundColor: '#ff6'
    });

    supr(this, 'init', [opts]);
  };
});
