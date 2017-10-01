import ui.ViewPool as ViewPool;

import .MoonYellowBlock as MoonYellowBlock;

exports = Class(ViewPool, function(supr) {
  this.init = function (opts) {

    var block = null;

    switch(opts.blockType) {
      case 'moon_yellow':
        block = MoonYellowBlock;
        break;
      default:
        throw new Error('Unsupported block type');
    }

    opts = merge(opts, {
      ctor: block,
      initCount: opts && opts.count || 200
    });

    supr(this, 'init', [opts]);
  }
});
