import device;

import ui.TextView as TextView;
import ui.StackView as StackView;

import src.screens.MenuScreen as MenuScreen;
import src.screens.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    this.engine.updateOpts({
      preload: ['resources/images']
    });

    this.baseWidth = 576;
    this.baseHeight = device.height * (this.baseWidth / device.width);

    this.view.style.scale = device.width / this.baseWidth;

    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: this.baseWidth,
      height: this.baseHeight,
      clip: true
    });

    var menuScreen = new MenuScreen({
      superview: this
    });

    menuScreen.on('menu:startgame', function () {

      // TODO stop playing menu music
      // TODO start playing game music
      menuScreen.hide();
      rootView.push(gameScreen);
      gameScreen.emit('game:reset');
    });

    menuScreen.show();

    // Initiate game screen
    var gameScreen = new GameScreen({
      x: 0,
      y: 0,
      width: this.baseWidth,
      height: this.baseHeight
    });

    gameScreen.on('game:end', function () {

      // TODO stop playing any music
      // TODO start playing menu music
      rootView.pop();
      menuScreen.show();
    });

    rootView.push(menuScreen);

  };

  this.launchUI = function () {

  };

});
