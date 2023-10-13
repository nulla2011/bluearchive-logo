import './style.css';
import LogoCanvas from './canvas';
import loadSVGs from './utils/loadSVGs';
import './i18n';

(async function () {
  await loadSVGs();
  const logo = new LogoCanvas();
  logo.draw();
})();
