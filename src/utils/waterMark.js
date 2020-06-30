class Watermark {
  mo = null;

  container = null;

  params = null;

  getWatermark = ({
    container = document.body,
    width = '260px',
    height = '150px',
    textAlign = 'center',
    textBaseline = 'middle',
    font = '20px microsoft yahei',
    fillStyle = 'rgba(184, 184, 184, 0.2)',
    content = '请勿外传',
    rotate = '30',
    watermarkImg = '',
    isUseUserNameText = false,
  }) => {
    this.container = container;
    let base64Url = watermarkImg;
    if (!watermarkImg || isUseUserNameText) {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      const ctx = canvas.getContext('2d');
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
      ctx.rotate((Math.PI / 180) * rotate);
      ctx.translate(-parseFloat(width) / 2, -parseFloat(height) / 2);
      ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);
      base64Url = canvas.toDataURL();
    }

    const watermarkDiv = document.createElement('div');
    watermarkDiv.id = '__watermark-base__';
    const styleStr = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 99999999 !important;
      visibility: visible !important;
      pointer-events: none !important;
      background-image: url('${base64Url}') !important;
    `;
    watermarkDiv.setAttribute('style', `${styleStr}`);

    container.insertBefore(watermarkDiv, container.firstChild);
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    /** 监听dom变化 */
    if (MutationObserver) {
      this.mo = new MutationObserver(() => {
        const __wm = document.getElementById('__watermark-base__');
        // 只在__wm元素变动才重新调用 __canvasWM
        if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
          // 避免一直触发
          this.mo.disconnect();
          this.mo = null;
          this.getWatermark({
            container,
            width,
            height,
            textAlign,
            textBaseline,
            font,
            fillStyle,
            content,
            rotate,
            watermarkImg,
          });
        }
      });

      this.mo.observe(container, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    }
  };

  removeWatermark = () => {
    if (this.mo) {
      this.mo.disconnect();
      this.mo = null;
    }
    const __wm = document.getElementById('__watermark-base__');
    if (this.container && __wm) {
      this.container.removeChild(__wm);
    }
  };
}

export default new Watermark();
