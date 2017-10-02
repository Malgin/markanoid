import ui.TextView as TextView;

exports = Class(TextView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: 100,
      height: 50,
      x: 25,
      y: 0,
      autosize: false,
      verticalAlign: 'middle',
      horizontalAlign: 'left',
      wrap: false,
      color: '#fff'
    });

    supr(this, 'init', [opts]);
  };

  this.setScore = function (score) {
    this.setText(`Score: ${score}`);
  }
});
