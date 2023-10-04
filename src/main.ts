import './style.css';
import loadFont from './utils/loadFont';
import loadImages from './utils/loadImages';
import { fontSize, horizontalTilt, textPosition } from './settings';

(async function () {
  await loadFont();
  const [halo, cross] = await loadImages();
  const canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
  const app = canvas.getContext('2d')!;
  //Background
  app.fillStyle = '#fff';
  app.fillRect(0, 0, canvas.width, canvas.height);
  //blue text -> halo -> black text -> cross
  app.font = `${fontSize}px G2B`;
  app.save(); //save default status
  app.fillStyle = '#128AFA';
  app.textAlign = 'end';
  app.transform(1, 0, horizontalTilt, 1, 0, 0);
  app.fillText('Блю', canvas.width * textPosition.X, canvas.height * textPosition.Y);
  app.resetTransform(); //restore don't work
  app.drawImage(halo, canvas.width / 2 - 250 / 2, 0, 250, 250);
  app.fillStyle = '#2b2b2b';
  app.textAlign = 'start';
  app.strokeStyle = 'white';
  app.lineWidth = 12;
  app.transform(1, 0, horizontalTilt, 1, 0, 0);
  app.strokeText('Архив', canvas.width * textPosition.X, canvas.height * textPosition.Y);
  app.fillText('Архив', canvas.width * textPosition.X, canvas.height * textPosition.Y);
  app.resetTransform();
  app.drawImage(cross, canvas.width / 2 - 250 / 2, 0, 250, 250);
})();
