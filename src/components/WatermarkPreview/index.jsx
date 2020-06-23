import React, { Component } from 'react';

class WatermarkPreview extends Component {
  componentDidMount() {
    const {
      watermarkText = '请勿外传请勿外传',
      textAlign = 'center',
      textBaseline = 'middle',
      fillStyle = 'rgba(14, 184, 184, 0.2)',
      font = '20px microsoft yahei',
      rotate = '30',
      width = 300,
      height = 150,
      onChange,
    } = this.props;
    if (!this.ctx) {
      this.ctx = this.canvasRef.getContext('2d');
      Object.assign(this.ctx, {
        textAlign,
        textBaseline,
        font,
        fillStyle,
      });
      this.ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
      this.ctx.rotate((Math.PI / 180) * rotate);
      this.ctx.translate(-parseFloat(width) / 2, -parseFloat(height) / 2);
      this.ctx.fillText(watermarkText, parseFloat(width) / 2, parseFloat(height) / 2);

      const base64Url = this.canvasRef.toDataURL();
      if (onChange) {
        onChange(base64Url);
      }
    }
  }

  render() {
    const { width = 300, height = 150 } = this.props;

    return <canvas width={width} height={height} ref={inst => (this.canvasRef = inst)}></canvas>;
  }
}

export default WatermarkPreview;
