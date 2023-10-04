export default async () => {
  const FF = new FontFace('G2B', 'url(../RoGSanSrfStd-Bd_mod1.woff2)');
  await FF.load().then((font) => document.fonts.add(font));
};
