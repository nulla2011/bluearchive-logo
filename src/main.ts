import './style.css';
import LogoCanvas from './canvas';
import loadImages from './utils/loadImages';
import './i18n';

(async function () {
  // await loadFont();
  await loadImages();
  const logo = new LogoCanvas();
  logo.bindEvent();
  logo.draw();
})();
