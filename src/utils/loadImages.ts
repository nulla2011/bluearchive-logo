import halo from '../assets/image/halo.png';
import cross from '../assets/image/cross.png';

const loadImg = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};
export default async () => {
  return await Promise.all([loadImg(halo), loadImg(cross)]);
};
