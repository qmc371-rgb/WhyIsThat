import './brand/fonts';
import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './brand/tokens';
import {timing} from './lib/timing';
import {Opening} from './scenes/ep001/Opening';
import {Ep001Full} from './scenes/ep001/Ep001Full';
import {Ep001Thumbnail} from './scenes/ep001/Thumbnail';
import {StyleFrameMap} from './scenes/ep001/StyleFrameMap';
import {Ep002Full} from './scenes/ep002/Ep002Full';
import {Ep002Thumbnail} from './scenes/ep002/Thumbnail';
import {Ep003Full} from './scenes/ep003/Ep003Full';
import {timing as ep003Timing} from './scenes/ep003/timing';
import {Ep003Short} from './scenes/ep003/Short';
import {Ep003Thumbnail} from './scenes/ep003/Thumbnail';
import ep003ShortTiming from './data/ep003_short/narration_timing.json';
import {Ep002Short} from './scenes/ep002/Short';
import ep002ShortTiming from './data/ep002_short/narration_timing.json';
import {timing as ep002Timing} from './scenes/ep002/timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ep001Full"
      component={Ep001Full}
      durationInFrames={Math.ceil(timing.durationSec * VIDEO.fps)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{showDraftBug: false, showCaptions: false}}
    />
    <Composition
      id="Ep001Opening30"
      component={Opening}
      durationInFrames={30 * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{showDraftBug: true, showCaptions: false}}
    />
    <Still id="Ep001Thumbnail" component={Ep001Thumbnail} width={1280} height={720} />
    <Composition
      id="Ep002Full"
      component={Ep002Full}
      durationInFrames={Math.ceil(ep002Timing.durationSec * VIDEO.fps)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{showDraftBug: false, showCaptions: false}}
    />
    <Composition
      id="Ep002Opening30"
      component={Ep002Full}
      durationInFrames={30 * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{showDraftBug: false, showCaptions: false}}
    />
    <Composition id="Ep002Short" component={Ep002Short} durationInFrames={Math.ceil(ep002ShortTiming.durationSec * VIDEO.fps)} fps={VIDEO.fps} width={1080} height={1920} />
    <Composition id="Ep003Full" component={Ep003Full} durationInFrames={Math.ceil(ep003Timing.durationSec * VIDEO.fps)} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} defaultProps={{showDraftBug: false, showCaptions: false}} />
    <Composition id="Ep003Opening30" component={Ep003Full} durationInFrames={30 * VIDEO.fps} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} defaultProps={{showDraftBug: false, showCaptions: false}} />
    <Composition id="Ep003Short" component={Ep003Short} durationInFrames={Math.ceil(ep003ShortTiming.durationSec * VIDEO.fps)} fps={VIDEO.fps} width={1080} height={1920} />
    <Still id="Ep003Thumbnail" component={Ep003Thumbnail} width={1280} height={720} />
    <Still id="Ep002Thumbnail" component={Ep002Thumbnail} width={1280} height={720} />
    <Still id="Ep001StyleFrameMap" component={StyleFrameMap} width={VIDEO.width} height={VIDEO.height} />
  </>
);
