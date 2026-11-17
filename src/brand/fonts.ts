// Loads the OFL brand fonts from /public before any frame renders.
import {continueRender, delayRender, staticFile} from 'remotion';

const FILES: Array<[family: string, weight: string, file: string]> = [
  ['Fredoka', '500', 'fonts/fredoka-latin-500-normal.woff2'],
  ['Fredoka', '600', 'fonts/fredoka-latin-600-normal.woff2'],
  ['Fredoka', '700', 'fonts/fredoka-latin-700-normal.woff2'],
  ['Inter', '500', 'fonts/inter-latin-500-normal.woff2'],
  ['Inter', '600', 'fonts/inter-latin-600-normal.woff2'],
  ['Inter', '700', 'fonts/inter-latin-700-normal.woff2'],
  ['Inter', '800', 'fonts/inter-latin-800-normal.woff2'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading brand fonts');
  Promise.all(
    FILES.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight})
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error('Font load failed', err);
      continueRender(handle);
    });
}
