// Render review stills from one bundle: node scripts/stills.mjs <compId> <scale> <sec> [sec...]
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [id = 'Ep001Opening30', scaleArg = '0.5', ...secs] = process.argv.slice(2);
const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = `out/stills/${id}_${String(s).padStart(5, '0')}s.png`;
  await renderStill({composition, serveUrl, output, frame, browserExecutable, scale: Number(scaleArg)});
  console.log('wrote', output);
}
