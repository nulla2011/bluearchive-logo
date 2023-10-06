export default async () => {
  const G2B = new FontFace('G2B', 'url(../RoGSanSrfStd-Bd.otf)');
  const GSH = new FontFace('GSH', 'url(../GlowSansSC-Normal-Heavy.otf)');
  await Promise.all([G2B.load(), GSH.load()]).then((fonts) =>
    fonts.map((font) => document.fonts.add(font))
  );
};
