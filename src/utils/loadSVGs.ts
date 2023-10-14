import halo from '../assets/image/halo.svg';
import cross from '../assets/image/cross.svg';

const loadImg = async (src: string): Promise<string[]> => {
  const svg = await fetch(src);
  const svgText = await svg.text();

  const dp = new DOMParser();
  const doc = dp.parseFromString(svgText, 'image/svg+xml');
  const pathItems = doc.getElementsByTagName('path');
  return Array.from(pathItems).map((item) => item.getAttribute('d')!);
};
export default async () => {
  await Promise.all([
    loadImg(halo).then((img) => (window.halo = img)),
    loadImg(cross).then((img) => (window.cross = img)),
  ]);
};
