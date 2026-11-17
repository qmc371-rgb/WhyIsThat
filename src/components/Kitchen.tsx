// The one consistent kitchen: approved Higgsfield plate H1 (5504x3072 source,
// 3840 px render copy). World units are 1920x1080 at camera scale 1.
// Measured on the plate (1080 space): backsplash from y≈288, counter surface
// y 657–738, front lip to 774. Utensil crock occupies x≈580–715.
import React from 'react';
import {staticFile} from 'remotion';

export const COUNTER_Y = 722; // base line for the bowl near the counter front
export const COUNTER_BACK = 700; // base line for the microwave (further back)

export const Kitchen: React.FC = () => (
  <image
    href={staticFile('assets/higgsfield/H1_kitchen_plate_v1.jpg')}
    x={-7.5}
    y={0}
    width={1935}
    height={1080}
    preserveAspectRatio="none"
  />
);
