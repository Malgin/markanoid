import device;

import ui.TextView as TextView;
import ui.StackView as StackView;

import src.screens.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    this.engine.updateOpts({
      preload: ['resources/images']
    });

    var rootViewWidth = device.width / device.devicePixelRatio;
    var rootViewHeight = device.height / device.devicePixelRatio;

    this.view.style.scale = rootViewHeight / rootViewWidth;

    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: rootViewWidth,
      height: rootViewHeight,
      clip: true,
    });

    // TODO: initiate menu screen

    // Initiate game screen
    var gameScreen = new GameScreen();

    rootView.push(gameScreen); // Start the game right away. TODO: add menu screens

  };

  this.launchUI = function () {

  };

});
