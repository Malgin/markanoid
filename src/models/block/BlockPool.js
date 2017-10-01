import ui.ViewPool as ViewPool;

import .MoonYellowBlock as MoonYellowBlock;
import .SteelBlock as SteelBlock;
import .AsteroidBlueBlock as AsteroidBlueBlock;
import .ObsidianBlock as ObsidianBlock;

exports = Class(ViewPool, function(supr) {
  this.init = function (opts) {

    var block = null;

    switch(opts.blockType) {
      case 'moon_yellow':
        block = MoonYellowBlock;
        break;
      case 'steel':
        block = SteelBlock;
        break;
      case 'asteroid_blue':
        block = AsteroidBlueBlock;
        break;
      case 'obsidian':
        block = ObsidianBlock;
        break;
      default:
        console.log(opts.blockType);
        throw new Error('Unsupported block type');
    }

    opts = merge(opts, {
      ctor: block,
      initCount: opts && opts.count || 200
    });

    supr(this, 'init', [opts]);
  }
});
