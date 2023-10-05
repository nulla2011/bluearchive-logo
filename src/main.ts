import './style.css';
import Canvas from './canvas';
import loadFont from './utils/loadFont';
import loadImages from './utils/loadImages';

(async function () {
  await loadFont();
  await loadImages();
  const logo = new Canvas();
  logo.bindEvent();
  logo.draw();
})();
