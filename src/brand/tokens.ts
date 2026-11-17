// Why Is That? brand tokens. Core palette: deep navy, white, golden yellow.
export const C = {
  navy950: '#060F22',
  navy900: '#0B1A33',
  navy850: '#0E2140',
  navy800: '#122849',
  navy700: '#18335E',
  navy600: '#214175',
  navy500: '#2C548F',
  navy400: '#4A6FA8',
  navy300: '#7891BD',
  navy200: '#AEBEDA',
  white: '#FFFFFF',
  paper: '#F4F7FC',
  paperShade: '#D9E2EF',
  paperDeep: '#B8C6DB',
  gold: '#FFC52E',
  goldDeep: '#E7A400',
  goldLight: '#FFE184',
  // Food (kept in the gold/white family so it sits inside the brand palette)
  curry: '#F2B320',
  curryDeep: '#D48E12',
  curryLight: '#FFD45C',
  rice: '#FCFBF5',
  riceShade: '#E4DFCC',
  chicken: '#EDC58C',
  chickenShade: '#C9995A',
  potato: '#F7DA80',
  potatoShade: '#D9B455',
  skin: '#D9A07C',
  skinShade: '#B97F5B',
} as const;

export const FONT = {
  display: 'Fredoka, "Arial Rounded MT Bold", sans-serif',
  ui: 'Inter, "Helvetica Neue", Arial, sans-serif',
} as const;

export const VIDEO = {width: 1920, height: 1080, fps: 30} as const;
