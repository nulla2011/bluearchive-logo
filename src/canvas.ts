import debounce from 'lodash-es/debounce';
import settings from './settings';
import loadFont from './utils/loadFont';
const {
  canvasHeight,
  canvasWidth,
  fontSize,
  horizontalTilt,
  textBaseLine,
  graphOffset,
  paddingX,
  hollowPath,
} = settings;
const font = 'RoGSanSrfStd-Bd, GlowSansSC-Normal-Heavy_diff, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif';

export default class LogoCanvas {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public textL = 'Blue';
  public textR = 'Archive';
  private textMetricsL: TextMetrics | null = null;
  private textMetricsR: TextMetrics | null = null;
  private canvasWidthL = canvasWidth / 2;
  private canvasWidthR = canvasWidth / 2;
  private textWidthL = 0;
  private textWidthR = 0;
  private graphOffset = graphOffset;
  private transparentBg = false;
  private scaleLevel = 1;
  constructor() {
    this.canvas = document.querySelector('#canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.height = canvasHeight * this.scaleLevel;
    this.canvas.width = canvasWidth * this.scaleLevel;
    this.bindEvent();
  }
  async draw() {
    const loading = document.querySelector('#loading')!;
    loading.classList.remove('hidden');
    const c = this.ctx;
    //predict canvas width
    await loadFont(this.textL + this.textR, this.scaleLevel);
    loading.classList.add('hidden');
    c.font = `${fontSize * this.scaleLevel}px ${font}`;
    this.textMetricsL = c.measureText(this.textL);
    this.textMetricsR = c.measureText(this.textR);
    this.setWidth();
    this.canvas.height = canvasHeight * this.scaleLevel;
    //clear canvas
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //Background
    if (!this.transparentBg) {
      c.fillStyle = '#fff';
      c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    //guide line
    if (import.meta.env.DEV) {
      c.strokeStyle = '#00cccc';
      c.lineWidth = 1 * this.scaleLevel;
      c.beginPath();
      c.moveTo(this.canvasWidthL, 0);
      c.lineTo(this.canvasWidthL, this.canvas.height);
      c.stroke();
      console.log(this.textMetricsL.width, this.textMetricsR.width);
      console.log(this.textWidthL, this.textWidthR);
      c.moveTo(this.canvasWidthL - this.textWidthL, 0);
      c.lineTo(this.canvasWidthL - this.textWidthL, this.canvas.height);
      c.moveTo(this.canvasWidthL + this.textWidthR, 0);
      c.lineTo(this.canvasWidthL + this.textWidthR, this.canvas.height);
      c.stroke();
    }
    //blue text -> halo -> black text -> cross
    c.font = `${fontSize * this.scaleLevel}px ${font}`;
    c.fillStyle = '#128AFA';
    c.textAlign = 'end';
    c.setTransform(1, 0, horizontalTilt, 1, 0, 0);
    c.fillText(this.textL, this.canvasWidthL, this.canvas.height * textBaseLine);
    c.resetTransform(); //restore don't work
    c.drawImage(
      window.halo,
      this.canvasWidthL - this.canvas.height / 2 + (this.graphOffset.X * this.scaleLevel),
      this.graphOffset.Y * this.scaleLevel,
      canvasHeight * this.scaleLevel,
      canvasHeight * this.scaleLevel
    );
    c.fillStyle = '#2B2B2B';
    c.textAlign = 'start';
    if (this.transparentBg) {
      c.globalCompositeOperation = 'destination-out';
    }
    c.strokeStyle = 'white';
    c.lineWidth = 12 * this.scaleLevel;
    c.setTransform(1, 0, horizontalTilt, 1, 0, 0);
    c.strokeText(this.textR, this.canvasWidthL, this.canvas.height * textBaseLine);
    c.globalCompositeOperation = 'source-over';
    c.fillText(this.textR, this.canvasWidthL, this.canvas.height * textBaseLine);
    c.resetTransform();
    const graph = {
      X: this.canvasWidthL - this.canvas.height / 2 + (graphOffset.X * this.scaleLevel),
      Y: this.graphOffset.Y * this.scaleLevel,
    };
    c.beginPath();
    c.moveTo(
      graph.X + ((hollowPath[0][0] * this.scaleLevel) / (500 * this.scaleLevel)) * (canvasHeight * this.scaleLevel),
      graph.Y + ((hollowPath[0][1] * this.scaleLevel) / (500 * this.scaleLevel)) * (canvasHeight * this.scaleLevel)
    );
    for (let i = 1; i < 4; i++) {
      c.lineTo(
        graph.X + ((hollowPath[i][0] * this.scaleLevel) / (500 * this.scaleLevel)) * (canvasHeight * this.scaleLevel),
        graph.Y + ((hollowPath[i][1] * this.scaleLevel) / (500 * this.scaleLevel)) * (canvasHeight * this.scaleLevel)
      );
    }
    c.closePath();
    if (this.transparentBg) {
      c.globalCompositeOperation = 'destination-out';
    }
    c.fillStyle = 'white';
    c.fill();
    c.globalCompositeOperation = 'source-over';
    c.drawImage(
      window.cross,
      this.canvasWidthL - this.canvas.height / 2 + (graphOffset.X * this.scaleLevel),
      this.graphOffset.Y * this.scaleLevel,
      canvasHeight * this.scaleLevel,
      canvasHeight * this.scaleLevel
    );
  }
  bindEvent() {
    const process = (id: 'textL' | 'textR', el: HTMLInputElement) => {
      this[id] = el.value;
      this.draw();
    };
    for (const t of ['textL', 'textR']) {
      const id = t as 'textL' | 'textR';
      const el = document.getElementById(id)! as HTMLInputElement;
      el.addEventListener('compositionstart', () => el.setAttribute('composing', ''));
      el.addEventListener('compositionend', () => {
        process(id, el);
        el.removeAttribute('composing');
      });
      el.addEventListener(
        'input',
        debounce(() => {
          if (el.hasAttribute('composing')) {
            return;
          }
          process(id, el);
        }, 300)
      );
    }
    document.querySelector('#save')!.addEventListener('click', () => this.saveImg());
    document.querySelector('#copy')!.addEventListener('click', () => this.copyImg());
    const tSwitch = document.querySelector('#transparent')! as HTMLInputElement;
    tSwitch.addEventListener('change', () => {
      this.transparentBg = tSwitch.checked;
      this.draw();
    });
    const gx = document.querySelector('#graphX')! as HTMLInputElement;
    const gy = document.querySelector('#graphY')! as HTMLInputElement;
    gx.addEventListener('input', () => {
      this.graphOffset.X = parseInt(gx.value);
      this.draw();
    });
    gy.addEventListener('input', () => {
      this.graphOffset.Y = parseInt(gy.value);
      this.draw();
    });
    const scaleInput = document.querySelector('#scaleLevel')! as HTMLInputElement;
    scaleInput.addEventListener('input', () => {
      this.scaleLevel = parseInt(scaleInput.value);
      this.draw();
    });
  }
  setWidth() {
    this.textWidthL =
      this.textMetricsL!.width -
      (textBaseLine * (canvasHeight * this.scaleLevel) + this.textMetricsL!.fontBoundingBoxDescent) * horizontalTilt;
    this.textWidthR =
      this.textMetricsR!.width +
      (textBaseLine * (canvasHeight * this.scaleLevel) - this.textMetricsR!.fontBoundingBoxAscent) * horizontalTilt;
    //extend canvas
    if (this.textWidthL + (paddingX * this.scaleLevel) > (canvasWidth * this.scaleLevel) / 2) {
      this.canvasWidthL = this.textWidthL + (paddingX * this.scaleLevel);
    } else {
      this.canvasWidthL = (canvasWidth * this.scaleLevel) / 2;
    }
    if (this.textWidthR + (paddingX * this.scaleLevel) > (canvasWidth * this.scaleLevel) / 2) {
      this.canvasWidthR = this.textWidthR + (paddingX * this.scaleLevel);
    } else {
      this.canvasWidthR = (canvasWidth * this.scaleLevel) / 2;
    }
    this.canvas.width = this.canvasWidthL + this.canvasWidthR;
  }
  generateImg() {
    let outputCanvas: HTMLCanvasElement;
    if (
      this.textWidthL + (paddingX * this.scaleLevel) < (canvasWidth * this.scaleLevel) / 2 ||
      this.textWidthR + (paddingX * this.scaleLevel) < (canvasWidth * this.scaleLevel) / 2
    ) {
      outputCanvas = document.createElement('canvas');
      outputCanvas.width = this.textWidthL + this.textWidthR + (paddingX * this.scaleLevel) * 2;
      outputCanvas.height = this.canvas.height;
      const ctx = outputCanvas.getContext('2d')!;
      ctx.drawImage(
        this.canvas,
        (canvasWidth * this.scaleLevel) / 2 - this.textWidthL - (paddingX * this.scaleLevel),
        0,
        this.textWidthL + this.textWidthR + (paddingX * this.scaleLevel) * 2,
        this.canvas.height,
        0,
        0,
        this.textWidthL + this.textWidthR + (paddingX * this.scaleLevel) * 2,
        this.canvas.height
      );
    } else {
      outputCanvas = this.canvas;
    }
    return new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject();
        }
      });
    });
  }
  saveImg() {
    this.generateImg().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.textL}${this.textR}_ba-style@nulla.top.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  async copyImg() {
    const blob = await this.generateImg();
    const cp = [new ClipboardItem({ 'image/png': blob })];
    navigator.clipboard
      .write(cp)
      .then(() => {
        console.log('image copied');
        const msg = document.querySelector('#message-switch') as HTMLInputElement;
        msg.checked = true;
        setTimeout(() => (msg.checked = false), 2000);
      })
      .catch((e) => console.error("can't copy", e));
  }
}
