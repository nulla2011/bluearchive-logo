import debounce from 'lodash-es/debounce';
import { fontSize, horizontalTilt, textPosition } from './settings';

export default class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public text1 = 'Blue';
  public text2 = 'Archive';
  constructor() {
    this.canvas = document.querySelector('#canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
  }
  draw() {
    const c = this.ctx;
    //clear canvas
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //Background
    c.fillStyle = '#fff';
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //blue text -> halo -> black text -> cross
    c.font = `${fontSize}px G2B`;
    c.fillStyle = '#128AFA';
    c.textAlign = 'end';
    c.transform(1, 0, horizontalTilt, 1, 0, 0);
    c.fillText(this.text1, this.canvas.width * textPosition.X, this.canvas.height * textPosition.Y);
    c.resetTransform(); //restore don't work
    c.drawImage(window.halo, this.canvas.width / 2 - 250 / 2, 0, 250, 250);
    c.fillStyle = '#2b2b2b';
    c.textAlign = 'start';
    c.strokeStyle = 'white';
    c.lineWidth = 12;
    c.transform(1, 0, horizontalTilt, 1, 0, 0);
    c.strokeText(
      this.text2,
      this.canvas.width * textPosition.X,
      this.canvas.height * textPosition.Y
    );
    c.fillText(this.text2, this.canvas.width * textPosition.X, this.canvas.height * textPosition.Y);
    c.resetTransform();
    c.drawImage(window.cross, this.canvas.width / 2 - 250 / 2, 0, 250, 250);
  }
  bindEvent() {
    for (const id of ['text1', 'text2']) {
      const el = document.getElementById(id)! as HTMLInputElement;
      el.addEventListener(
        'input',
        debounce(() => {
          switch (id) {
            case 'text1':
              this.text1 = el.value;
              break;
            case 'text2':
              this.text2 = el.value;
              break;
            default:
              break;
          }
          this.draw();
        }, 500)
      );
    }
  }
}
