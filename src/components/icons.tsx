import Svg, { Circle, Path, Rect } from 'react-native-svg';

const paths: Record<string, string[]> = {
  home: ['M4 11.5 12 4l8 7.5', 'M6 10.5V20h12v-9.5'],
  sun: ['M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M12 3.5V6', 'M12 18v2.5', 'M4.8 6.2l1.8 1.8', 'M17.4 16l1.8 1.8', 'M4.8 17.8l1.8-1.8', 'M17.4 8l1.8-1.8'],
  layers: ['M12 3.5 21 8.5 12 13.5 3 8.5 12 3.5', 'M3 13.5 12 18.5 21 13.5'],
  users: ['M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6', 'M16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6', 'M3 19c.6-3 3-5 5-5s4.4 2 5 5', 'M11 19c.5-2.6 2.6-4.4 5-4.4 2.3 0 4.4 1.8 5 4.4'],
  menu: ['M5 7h14', 'M5 12h14', 'M5 17h14'],
  bell: ['M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16', 'M10 19a2 2 0 0 0 4 0'],
  back: ['M15 5 8 12l7 7'],
  check: ['M5 12.5 9.5 17 19 7.5'],
  book: ['M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4', 'M5 17a3 3 0 0 1 3-3h11'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3.5V7', 'M16 3.5V7'],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M3 20h18'],
  bolt: ['M13 3 5 13h6l-1 8 8-10h-6l1-8'],
  cap: ['M2 9l10-5 10 5-10 5L2 9', 'M6 11.5V16c3 2 9 2 12 0v-4.5'],
  chat: ['M4 5h16v10H9l-5 4V5'],
  star: ['M12 3.5l2.4 5 5.6.8-4 4 1 5.6L12 16.2 7 18.9l1-5.6-4-4 5.6-.8L12 3.5'],
  send: ['M4 12 20 4l-6 16-2.4-6.2L4 12'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14', 'M16 16l4 4'],
  bookmark: ['M6 3h12v18l-6-4-6 4V3'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  lock: ['M7 11V8a5 5 0 0 1 10 0v3', 'M5 11h14v9H5z'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M12 11v6', 'M12 8h.01'],
  plus: ['M12 5v14', 'M5 12h14'],
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  pin: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11'],
};

export function Icon({
  name,
  size = 22,
  color,
}: {
  name: keyof typeof paths | 'dot';
  size?: number;
  color: string;
}) {
  if (name === 'dot') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="4" fill={color} />
      </Svg>
    );
  }
  const d = paths[name] || paths.info;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {d.map((path) => (
        <Path key={path} d={path} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {name === 'calendar' ? <Rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth={1.7} fill="none" /> : null}
    </Svg>
  );
}

export type IconName = keyof typeof paths;
