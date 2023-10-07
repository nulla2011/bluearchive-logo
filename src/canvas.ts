import debounce from 'lodash-es/debounce';
import settings from './settings';
import loadFont from './utils/loadFont';
const { canvasHeight, canvasWidth, fontSize, horizontalTilt, textPosition, graphOffset, paddingX } =
  settings;
const font = `${fontSize}px RoGSanSrfStd-Bd, GlowSansSC-Normal-Heavy, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif`;
export default class LogoCanvas {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public textL = 'Blue';
  public textR = 'Archive';
  private textMetricsL: TextMetrics | null = null;
  private textMetricsR: TextMetrics | null = null;
  public textWidthL = 0;
  public textWidthR = 0;
  constructor() {
    this.canvas = document.querySelector('#canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.height = canvasHeight;
    this.canvas.width = canvasWidth;
  }
  async draw() {
    const c = this.ctx;
    //predict canvas width
    await loadFont(this.textL + this.textR);
    c.font = font;
    this.textMetricsL = c.measureText(this.textL);
    this.textMetricsR = c.measureText(this.textR);
    this.setWidth();
    //clear canvas
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //Background
    c.fillStyle = '#fff';
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //guide line
    if (import.meta.env.DEV) {
      c.strokeStyle = '#00cccc';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(this.canvas.width / 2, 0);
      c.lineTo(this.canvas.width / 2, this.canvas.height);
      c.stroke();
      console.log(this.textMetricsL.width, this.textMetricsR.width);
      console.log(this.textWidthL, this.textWidthR);
      c.moveTo(this.canvas.width / 2 - this.textWidthL, 0);
      c.lineTo(this.canvas.width / 2 - this.textWidthL, this.canvas.height);
      c.moveTo(this.canvas.width / 2 + this.textWidthR, 0);
      c.lineTo(this.canvas.width / 2 + this.textWidthR, this.canvas.height);
      c.stroke();
    }
    //blue text -> halo -> black text -> cross
    c.font = font;
    c.fillStyle = '#128AFA';
    c.textAlign = 'end';
    c.setTransform(1, 0, horizontalTilt, 1, 0, 0);
    c.fillText(this.textL, this.canvas.width * textPosition.X, this.canvas.height * textPosition.Y);
    c.resetTransform(); //restore don't work
    c.drawImage(
      window.halo,
      this.canvas.width / 2 - canvasHeight / 2 + graphOffset,
      0,
      canvasHeight,
      canvasHeight
    );
    c.fillStyle = '#2B2B2B';
    c.textAlign = 'start';
    c.strokeStyle = 'white';
    c.lineWidth = 12;
    c.setTransform(1, 0, horizontalTilt, 1, 0, 0);
    c.strokeText(
      this.textR,
      this.canvas.width * textPosition.X,
      this.canvas.height * textPosition.Y
    );
    c.fillText(this.textR, this.canvas.width * textPosition.X, this.canvas.height * textPosition.Y);
    c.resetTransform();
    c.drawImage(
      window.cross,
      this.canvas.width / 2 - canvasHeight / 2 + graphOffset,
      0,
      canvasHeight,
      canvasHeight
    );
  }
  bindEvent() {
    for (const id of ['textL', 'textR']) {
      const el = document.getElementById(id)! as HTMLInputElement;
      el.addEventListener(
        'input',
        debounce(() => {
          switch (id) {
            case 'textL':
              this.textL = el.value;
              break;
            case 'textR':
              this.textR = el.value;
              break;
            default:
              break;
          }
          this.draw();
        }, 500)
      );
    }
    document.querySelector('#save')!.addEventListener('click', () => {
      this.saveImg();
    });
    document.querySelector('#copy')!.addEventListener('click', () => {
      this.copyImg();
    });
  }
  setWidth() {
    this.textWidthR =
      this.textMetricsR!.width +
      (textPosition.Y * canvasHeight - this.textMetricsR!.fontBoundingBoxAscent) * horizontalTilt;
    this.textWidthL =
      this.textMetricsL!.width -
      (textPosition.Y * canvasHeight + this.textMetricsL!.fontBoundingBoxDescent) * horizontalTilt;
    const maxWidth = Math.ceil(Math.max(this.textWidthL, this.textWidthR)) + paddingX;
    if (maxWidth * 2 > canvasWidth) {
      this.canvas.width = maxWidth * 2;
    } else {
      this.canvas.width = canvasWidth;
    }
  }
  generateImg() {
    const imgCanvas = new OffscreenCanvas(
      this.textWidthL + this.textWidthR + paddingX * 2,
      this.canvas.height
    );
    const ctx = imgCanvas.getContext('2d')!;
    ctx.drawImage(
      this.canvas,
      this.canvas.width / 2 - this.textWidthL - paddingX,
      0,
      this.textWidthL + this.textWidthR + paddingX * 2,
      this.canvas.height,
      0,
      0,
      this.textWidthL + this.textWidthR + paddingX * 2,
      this.canvas.height
    );
    return imgCanvas.convertToBlob();
  }
  saveImg() {
    this.generateImg().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ba-style-logo@nulla.top_${Math.round(new Date().getTime() / 1000)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  copyImg() {
    this.generateImg().then((blob) => {
      const cp = [new ClipboardItem({ 'image/png': blob })];
      navigator.clipboard
        .write(cp)
        .then(() => console.log('image copied'))
        .catch((e) => console.error("can't copy", e));
    });
  }
}
