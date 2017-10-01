import menus.views.MenuView as MenuView;
import menus.views.TextDialogView as TextDialogView;

import menus.constants.menuConstants as menuConstants;

exports = Class(MenuView, function (supr) {

  this.init = function (opts) {

    opts = merge(opts, {
      title: 'Markanoid',
      items: [
        {
          item: 'Start game',
          action: bind(this, function () {
            this.emit('menu:startgame');
          })
        },
        {
          item: 'Score',
          action: '' // TODO TBD
        }
      ],
      showTransitionMethod: menuConstants.transitionMethod.SCALE,
      hideTransitionMethod: menuConstants.transitionMethod.SCALE
    });

    supr(this, 'init', [opts]);
  };
});
