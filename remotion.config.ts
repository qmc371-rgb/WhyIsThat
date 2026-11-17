// Why Is That? — Remotion render config (separate project from Beyond the Bulkhead).
import {Config} from '@remotion/cli/config';

// This container cannot download Remotion's Chrome build; use the preinstalled
// headless shell. Override with REMOTION_BROWSER on other machines.
const browser =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
Config.setBrowserExecutable(browser);
Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setCodec('h264');
// CRF is passed per render (scripts/render_*.sh) so audio-only renders stay valid.
Config.setColorSpace('bt709'); // limited-range BT.709 (standard delivery), not full-range yuvj420p
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
