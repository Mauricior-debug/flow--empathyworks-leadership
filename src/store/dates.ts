export function iso(d: Date = new Date()): string {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
}

export function parseISO(s: string): Date {
  return new Date(s.slice(0, 10) + 'T12:00:00');
}

export function addDays(s: string, n: number): string {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function monday(s: string): string {
  const d = parseISO(s);
  const w = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - w);
  return iso(d);
}

export function weekNo(week: string): number {
  const a = Date.parse(week.slice(0, 10) + 'T12:00:00Z');
  const b = Date.parse('2026-01-05T12:00:00Z');
  return Math.round((a - b) / 604800000);
}

export function fmt(s: string, opts?: Intl.DateTimeFormatOptions): string {
  return parseISO(s).toLocaleDateString(
    'en-GB',
    opts || { day: 'numeric', month: 'short', year: 'numeric' },
  );
}

export function fmtLong(s: string): string {
  return fmt(s, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function fmtDay(s: string): string {
  return fmt(s, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function ago(isoStamp: string, today = iso()): string {
  const days = Math.round((parseISO(today).getTime() - parseISO(isoStamp).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  return fmt(isoStamp, { day: 'numeric', month: 'short' });
}

export function uid(prefix = 'id'): string {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

export function monthKey(s: string): string {
  return s.slice(0, 7);
}

export function withinDays(from: string, to: string, days: number): boolean {
  const a = parseISO(from).getTime();
  const b = parseISO(to).getTime();
  return b > a && b - a <= days * 86400000;
}

export function isWeekday(s: string): boolean {
  const day = parseISO(s).getDay();
  return day !== 0 && day !== 6;
}
