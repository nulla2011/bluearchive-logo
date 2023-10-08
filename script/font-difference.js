import { Font } from 'fonteditor-core';
import Fontmin from 'fontmin';
import fs from 'fs';

const G2font = Font.create(fs.readFileSync('../public/RoGSanSrfStd-Bd.otf'), {
  type: 'otf',
});
const G2List = G2font.find({
  filter: (glyf) => {
    if (
      glyf.unicode &&
      glyf.unicode.some((c) => c >= parseInt('0x4E00') && c < parseInt('0xA000'))
    ) {
      return !(glyf.xMin === 408 && glyf.xMax === 592 && glyf.yMin === 452 && glyf.yMax === 636);
    }
    return true;
  },
}).reduce((p, c) => {
  if (!c.unicode) {
    return p;
  } else return p.concat(c.unicode);
}, []);
const GlowFont = Font.create(fs.readFileSync('../public/GlowSansSC-Normal-Heavy.otf'), {
  type: 'otf',
});
const GlowList = Object.keys(GlowFont.get().cmap);
const differenceList = GlowList.filter((c) => !G2List.includes(parseInt(c)));
console.assert(differenceList.includes(String(parseInt('0x531a'))));
new Fontmin()
  .src('../public/GlowSansSC-Normal-Heavy.otf')
  .use(Fontmin.otf2ttf())
  .use(
    Fontmin.glyph({
      text: differenceList.reduce((p, c) => p + String.fromCharCode(c), ''),
      hinting: false,
    })
  )
  .dest('../public/GlowSansSC-Normal-Heavy_diff.ttf')
  .run();
