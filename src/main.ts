import './style.css';
import LogoCanvas from './canvas';
import loadFont from './utils/loadFont';
import loadImages from './utils/loadImages';

(async function () {
  await loadFont();
  await loadImages();
  const logo = new LogoCanvas();
  logo.bindEvent();
  logo.draw();
})();
