// EP001 full episode: cold open + sections, all timed from the final narration.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C} from '../../brand/tokens';
import {line, timing} from '../../lib/timing';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';
import {OpeningSfx, OpeningShots, Sfx, Shot, openingShotAt} from './Opening';
import {S02TwoQuestions, S03WhatItDoes, S04NotHotAir, S05MapAndTurntable, S07Heater, S08Dinner} from './SectionsA';
import {S09Bowl, S10InsideOut, S11WhatHelps, S12Recap, S13Outro} from './SectionsB';

export const sectionWindows = () => {
  const b = (id: string) => line(id).start;
  return {
    s02: b('L07') - 0.4,
    s03: b('L10') - 0.35,
    s04: b('L13') - 0.35,
    s05: b('L15') - 0.35,
    s07: b('L23') - 0.35,
    s08: b('L25') - 0.35,
    s09: b('L29') - 0.35,
    s10: b('L35') - 0.35,
    s11: b('L40') - 0.3,
    s12: b('L47') - 0.35,
    s13: b('L55') - 0.35,
  };
};

export const Ep001Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = sectionWindows();
  const order: Array<[keyof typeof W, string]> = [
    ['s02', '2 QUESTIONS'],
    ['s03', 'WHAT IT DOES'],
    ['s04', 'NOT HOT AIR'],
    ['s05', 'MAP + TURNTABLE'],
    ['s07', 'HEATER'],
    ['s08', 'DINNER'],
    ['s09', 'THE BOWL'],
    ['s10', 'INSIDE-OUT'],
    ['s11', 'WHAT HELPS'],
    ['s12', 'RECAP'],
    ['s13', 'OUTRO'],
  ];
  const sectionAt = (t: number) => {
    let name = `COLD OPEN ${openingShotAt(t)}`;
    for (const [k, n] of order) if (t >= W[k]) name = n;
    return name;
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      <OpeningSfx />
      {order.map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={W.s03} file="hum_loop.wav" vol={0.12} dur={line('L11').start - W.s03} loop />
      <Sfx at={line('L56').words[3].start + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} /> {/* lands with the gold “?” */}

      <OpeningShots titleUntil={W.s02} />
      <Shot from={W.s02} to={W.s03} fadeIn={0.35}>
        <S02TwoQuestions />
      </Shot>
      <Shot from={W.s03} to={W.s04} fadeIn={0.35}>
        <S03WhatItDoes />
      </Shot>
      <Shot from={W.s04} to={W.s05} fadeIn={0.35}>
        <S04NotHotAir />
      </Shot>
      <Shot from={W.s05} to={W.s07} fadeIn={0.35}>
        <S05MapAndTurntable />
      </Shot>
      <Shot from={W.s07} to={W.s08} fadeIn={0.35}>
        <S07Heater />
      </Shot>
      <Shot from={W.s08} to={W.s09} fadeIn={0.35}>
        <S08Dinner />
      </Shot>
      <Shot from={W.s09} to={W.s10} fadeIn={0.35}>
        <S09Bowl />
      </Shot>
      <Shot from={W.s10} to={W.s11} fadeIn={0.35}>
        <S10InsideOut />
      </Shot>
      <Shot from={W.s11} to={W.s12} fadeIn={0.35}>
        <S11WhatHelps />
      </Shot>
      <Shot from={W.s12} to={W.s13} fadeIn={0.35}>
        <S12Recap />
      </Shot>
      <Shot from={W.s13} to={1e9} fadeIn={0.35}>
        <S13Outro />
      </Shot>

      {showCaptions && <CaptionOverlay />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP001 FULL · REVIEW COPY" />
    </AbsoluteFill>
  );
};
