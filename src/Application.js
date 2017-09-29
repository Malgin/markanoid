import device;

import ui.TextView as TextView;
import ui.StackView as StackView;

import src.screens.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    // scale
    this.baseWidth = 1024;
    this.baseHeight = 576;
    this.scale = this.baseHeight / this.baseWidth;
    this.view.style.scale = this.scale;

    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: 1024,
      height: 576,
      clip: true,
      scale: device.width / 320
    });

    // TODO: initiate menu screen

    // Initiate game screen
    var gameScreen = new GameScreen();

    rootView.push(gameScreen); // Start the game right away. TODO: add menu screens

  };

  this.launchUI = function () {

  };

});
