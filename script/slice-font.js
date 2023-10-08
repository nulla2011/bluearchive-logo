import { resolve } from 'path';
import createFontSlice from 'font-slice';

createFontSlice({
  fontPath: resolve('../public/GlowSansSC-Normal-Heavy_diff.ttf'),
  outputDir: resolve('../public/GlowSans'),
});
