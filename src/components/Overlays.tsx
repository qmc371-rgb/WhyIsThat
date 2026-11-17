// Review overlays. While the timing file comes from temporary narration the
// NOT FOR PUBLICATION bug is forced on, whatever the composition props say.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand/tokens';
import {timing, unresolvedCues} from '../lib/timing';
import ep001Captions from '../data/ep001/captions.json';

export const DraftBug: React.FC<{
  shotAt: (t: number) => string;
  show: boolean;
  label?: string;
  notForPublication?: boolean; // defaults to EP001's timing flag
  unresolved?: string[];
}> = ({shotAt, show, label = 'EP001 OPENING · PREVIEW', notForPublication, unresolved = unresolvedCues}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const temp = (notForPublication ?? timing.notForPublication) === true;
  if (!show && !temp) return null;
  const t = frame / fps;
  const pill: React.CSSProperties = {
    fontFamily: FONT.ui,
    fontWeight: 600,
    fontSize: 17,
    letterSpacing: '0.06em',
    color: 'rgba(255,255,255,0.82)',
    background: 'rgba(6,15,34,0.62)',
    padding: '8px 14px',
    borderRadius: 10,
    lineHeight: 1.45,
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 28, top: 24, ...pill}}>
        <div style={{color: C.gold, fontWeight: 800}}>WHY IS THAT? · {label}</div>
        <div>{temp ? 'TEMP VOICE (KOKORO TTS) · PLACEHOLDER ART · NOT FOR PUBLICATION' : 'REVIEW COPY'}</div>
        {unresolved.length > 0 && <div style={{color: C.goldLight}}>UNRESOLVED CUES: {unresolved.join(' | ')}</div>}
      </div>
      <div style={{position: 'absolute', right: 28, top: 24, ...pill, fontVariantNumeric: 'tabular-nums'}}>
        {t.toFixed(1).padStart(5, '0')} s · {shotAt(t)}
      </div>
    </AbsoluteFill>
  );
};

type Cap = {text: string; startMs: number; endMs: number};

export const CaptionOverlay: React.FC<{captions?: Cap[]}> = ({captions = ep001Captions as Cap[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cap = captions.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cap) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70}}>
      <div
        style={{
          maxWidth: 1200,
          textAlign: 'center',
          fontFamily: FONT.ui,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.3,
          color: C.white,
          background: 'rgba(6,15,34,0.82)',
          padding: '10px 22px',
          borderRadius: 12,
        }}
      >
        {cap.text}
      </div>
    </AbsoluteFill>
  );
};
