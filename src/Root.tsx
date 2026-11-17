import './brand/fonts';
import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './brand/tokens';
import {timing} from './lib/timing';
import {Opening} from './scenes/ep001/Opening';
import {Ep001Full} from './scenes/ep001/Ep001Full';
import {Ep001Thumbnail} from './scenes/ep001/Thumbnail';
import {StyleFrameMap} from './scenes/ep001/StyleFrameMap';

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
    <Still id="Ep001StyleFrameMap" component={StyleFrameMap} width={VIDEO.width} height={VIDEO.height} />
  </>
);
