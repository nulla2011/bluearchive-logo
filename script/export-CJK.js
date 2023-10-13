import { Font } from 'fonteditor-core';
import Fontmin from 'fontmin';
import fs from 'fs';

const buffer = fs.readFileSync('../public/RoGSanSrfStd-Bd.otf');
const fontPre = Font.create(buffer, {
  type: 'otf',
});
const fontObject = fontPre.get();
const codeList = Object.keys(fontObject.cmap)
  .filter((n) => n >= parseInt('0x4E00') && n < parseInt('0xA000'))
  .map((n) => parseInt(n));
const font = Font.create(buffer, {
  type: 'otf',
  subset: codeList,
});
const result = font
  .find({
    filter: (glyf) =>
      !(glyf.xMin === 408 && glyf.xMax === 592 && glyf.yMin === 452 && glyf.yMax === 636),
  }) //remove dot glyph
  .reduce((p, c) => {
    if (!c.unicode) {
      return p;
    }
    for (const u of c.unicode) {
      p.push(u);
    }
    return p;
  }, []);
new Fontmin()
  .src('../public/RoGSanSrfStd-Bd.otf')
  .use(Fontmin.otf2ttf())
  .use(
    Fontmin.glyph({ text: result.reduce((p, c) => p + String.fromCharCode(c), ''), hinting: false })
  )
  .use(Fontmin.ttf2woff2())
  .dest('../public/RoGSS-B_CJK')
  .run();
