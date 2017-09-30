import ui.ViewPool as ViewPool;

import .Block as Block;

exports = Class(ViewPool, function(supr) {
  this.init = function (opts) {

    opts = merge(opts, {
      ctor: Block,
      initCount: opts && opts.count || 60
    });

    supr(this, 'init', [opts]);
  }
});
