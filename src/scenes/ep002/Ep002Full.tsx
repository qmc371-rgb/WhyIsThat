// EP002 full episode — "Why Is There a Tiny Hole in Airplane Windows?" — timed from the final narration.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C} from '../../brand/tokens';
import {line, timing, unresolvedCues} from './timing';
import {Sfx, Shot} from '../../kit/shots';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';
import ep002Captions from '../../data/ep002/captions.json';
import {ColdOpen, CrossSectionScene, Layers, Pressure, Reframe, coldOpenCues, layersCues, sectionCues} from './SectionsA';
import {Analogy, Backup, Naming, Outro, SystemJobs} from './SectionsB';

export const ep002Windows = () => ({
  layers: coldOpenCues().b1,
  reframe: line('L12').start - 0.35,
  pressure: line('L15').start - 0.35,
  section: line('L19').start - 0.35,
  analogy: line('L30').start - 0.35,
  backup: line('L39').start - 0.35,
  jobs: line('L43').start - 0.35,
  naming: line('L48').start - 0.35,
  outro: line('L56').start - 0.35,
});

const ORDER: Array<[keyof ReturnType<typeof ep002Windows>, string]> = [
  ['layers', 'B LAYERS'],
  ['reframe', 'C REFRAME'],
  ['pressure', 'D PRESSURE'],
  ['section', 'E CROSS-SECTION'],
  ['analogy', 'F ANALOGY'],
  ['backup', 'G BACKUP'],
  ['jobs', 'H JOBS'],
  ['naming', 'I NAMING'],
  ['outro', 'J OUTRO'],
];

export const Ep002Sfx: React.FC = () => {
  const W = ep002Windows();
  const A = coldOpenCues();
  const l58 = line('L58').start - 0.35;
  const endWords = line('L61').words;
  return (
    <>
      <Sfx at={0} file="cabin_loop.wav" vol={0.1} dur={A.a4 + 0.25} loop fade={0.6} />
      <Sfx at={A.a5 - 0.3} file="cabin_loop.wav" vol={0.07} dur={A.title - A.a5 + 0.6} loop fade={0.5} />
      <Sfx at={W.outro - 0.2} file="cabin_loop.wav" vol={0.09} dur={l58 - W.outro + 0.4} loop fade={0.6} />
      <Sfx at={A.tiny} file="glint.wav" vol={0.2} dur={0.6} />
      <Sfx at={layersCues().tinyHole} file="glint.wav" vol={0.16} dur={0.6} />
      <Sfx at={sectionCues().ring} file="glint.wav" vol={0.14} dur={0.6} />
      <Sfx at={A.title - 0.15} file="whoosh.wav" vol={0.28} dur={0.7} />
      <Sfx at={A.words[2] + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
      {ORDER.slice(1).map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={endWords[3].start + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
    </>
  );
};

export const Ep002Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = ep002Windows();
  const sectionAt = (t: number) => {
    let name = 'A COLD OPEN';
    for (const [k, n] of ORDER) if (t >= W[k]) name = n;
    return name;
  };
  const next = (i: number) => (i + 1 < ORDER.length ? W[ORDER[i + 1][0]] : 1e9);
  const scenes: Record<string, React.ReactNode> = {
    layers: <Layers />,
    reframe: <Reframe />,
    pressure: <Pressure />,
    section: <CrossSectionScene />,
    analogy: <Analogy />,
    backup: <Backup />,
    jobs: <SystemJobs />,
    naming: <Naming />,
    outro: <Outro />,
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      <Ep002Sfx />
      <Shot from={0} to={W.layers}>
        <ColdOpen />
      </Shot>
      {ORDER.map(([k], i) => (
        <Shot key={k} from={W[k]} to={next(i)} fadeIn={0.35}>
          {scenes[k]}
        </Shot>
      ))}
      {showCaptions && <CaptionOverlay captions={ep002Captions} />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP002 FULL · REVIEW COPY" notForPublication={timing.notForPublication === true} unresolved={unresolvedCues} />
    </AbsoluteFill>
  );
};
