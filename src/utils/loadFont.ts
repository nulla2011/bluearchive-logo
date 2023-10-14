import settings from '../settings';

export default async (content: string = 'A', scaleLevel: number = 1) => {
  // const G2B = new FontFace('G2B', 'url(../RoGSanSrfStd-Bd_other.woff2)');
  // // const GSH = new FontFace('GSH', 'url(../GlowSansSC-Normal-Heavy.otf)');
  // await Promise.all([G2B.load() /*, GSH.load()*/]).then((fonts) =>
  //   fonts.map((font) => document.fonts.add(font))
  // );
  // const loadingSwitch = document.querySelector('#loading-switch') as HTMLInputElement;
  // loadingSwitch.checked = true;
  await document.fonts.load(
    `${settings.fontSize * scaleLevel}px RoGSanSrfStd-Bd, GlowSansSC-Normal-Heavy_diff`,
    content
  );
  // loadingSwitch.checked = false;
};
