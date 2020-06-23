// canvas 实现 watermark
export default ({
  container = document.body,
  width = '360px',
  height = '270px',
  textAlign = 'center',
  textBaseline = 'middle',
  font = '20px microsoft yahei',
  fillStyle = 'rgba(14, 184, 184, 0.2)',
  content = '请勿外传',
  rotate = '30',
}) => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  const ctx = canvas.getContext('2d');
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);
  const base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement('div');
  watermarkDiv.className = 'watermark-base';
  watermarkDiv.setAttribute(
    'style',
    `
    background-image:url('${base64Url}')`,
  );

  container.setAttribute('style', `position: relative;`);
  container.insertBefore(watermarkDiv, container.firstChild);
  // tempImg.onload = () => {
  //   ctx.textAlign = textAlign;
  //   ctx.textBaseline = textBaseline;
  //   ctx.font = font;
  //   ctx.fillStyle = fillStyle;
  //   ctx.rotate((Math.PI / 180) * rotate);
  //   ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);
  //   // ctx.drawImage(tempImg, 0, 0);
  //   const base64Url = canvas.toDataURL();
  //   const watermarkDiv = document.createElement('div');
  //   watermarkDiv.setAttribute(
  //     'style',
  //     `
  //     position:absolute;
  //     top:0;
  //     left:0;
  //     width:100%;
  //     height:100%;
  //     z-index:${zIndex};
  //     pointer-events:none;
  //     background-repeat:repeat;
  //     background-image:url('${base64Url}')`,
  //   );

  //   container.style.position = 'relative';
  //   container.insertBefore(watermarkDiv, container.firstChild);
  // };
  // ctx.textAlign = textAlign;
  // ctx.textBaseline = textBaseline;
  // ctx.font = font;
  // ctx.fillStyle = fillStyle;
  // ctx.rotate((Math.PI / 180) * rotate);
  // ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  // ctx.drawImage(img, 0, 0)
  // const base64Url = canvas.toDataURL();
  // const watermarkDiv = document.createElement('div');
  // watermarkDiv.setAttribute(
  //   'style',
  //   `
  //   position:absolute;
  //   top:0;
  //   left:0;
  //   width:100%;
  //   height:100%;
  //   z-index:${zIndex};
  //   pointer-events:none;
  //   background-repeat:repeat;
  //   background-image:url('${base64Url}')`,
  // );

  // container.style.position = 'relative';
  // container.insertBefore(watermarkDiv, container.firstChild);
};
