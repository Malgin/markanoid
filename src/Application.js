import device;

import ui.TextView as TextView;
import ui.StackView as StackView;

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

    // TODO: initiate menu screen

    // Initiate game screen
    var gameScreen = new GameScreen({
      x: 0,
      y: 0,
      width: this.baseWidth,
      height: this.baseHeight
    });

    rootView.push(gameScreen); // Start the game right away. TODO: add menu screens

  };

  this.launchUI = function () {

  };

});
