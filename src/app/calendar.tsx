import { useState } from 'react';
import { Text, View } from 'react-native';
import { BOOK_TYPES } from '../data/content';
import { fmt, iso } from '../store/dates';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Card, Chip, H1, StackScreen } from '../components/ui';

export default function Calendar() {
  const { data, user } = useApp();
  const { c, font, semibold } = useTheme();
  const today = iso();
  const [cursor, setCursor] = useState(today.slice(0, 7));
  const [selected, setSelected] = useState(today);
  if (!user) return null;
  const [year, month] = cursor.split('-').map(Number);
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  const pad = (first.getDay() + 6) % 7;
  const cells = [...Array(pad).fill(''), ...Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, '0'))];
  const key = (day: string) => cursor + '-' + day;
  const marks = (day: string) => {
    const date = key(day);
    return {
      todo: data.todos.some((t) => t.userId === user.id && t.date === date),
      call: data.appointments.some((a) => a.userId === user.id && a.date === date && a.status === 'confirmed'),
      workshop: data.bookings.some((b) => b.userId === user.id && b.status === 'booked' && data.workshops.find((w) => w.id === b.workshopId)?.date === date),
    };
  };
  const shift = (n: number) => {
    const d = new Date(year, month - 1 + n, 1);
    setCursor(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  };
  const agenda = [
    ...data.appointments.filter((a) => a.userId === user.id && a.date === selected && a.status === 'confirmed').map((a) => (BOOK_TYPES.find((t) => t.id === a.kind)?.name || 'Call') + ' · ' + a.slot),
    ...data.todos.filter((t) => t.userId === user.id && t.date === selected).map((t) => 'To-do · ' + t.title + (t.time ? ' · ' + t.time : '')),
    ...data.workshops.filter((w) => w.date === selected && data.bookings.some((b) => b.userId === user.id && b.workshopId === w.id && b.status === 'booked')).map((w) => 'Workshop · ' + w.title),
  ];
  return (
    <StackScreen title="Calendar">
      <H1>My calendar</H1>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Chip label="Previous" onPress={() => shift(-1)} />
        <Body>{fmt(cursor + '-01', { month: 'long', year: 'numeric' })}</Body>
        <Chip label="Next" onPress={() => shift(1)} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <Text key={d} style={{ width: '14.28%', textAlign: 'center', color: c.muted, fontSize: font(12) }}>{d}</Text>
        ))}
        {cells.map((day, i) => {
          const date = day ? key(day) : '';
          const m = day ? marks(day) : null;
          return (
            <View key={i} style={{ width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
              {day ? (
                <Text
                  onPress={() => setSelected(date)}
                  style={{
                    color: selected === date ? c.spruceInk : date === today ? c.spruce : c.ink,
                    backgroundColor: selected === date ? c.spruce : 'transparent',
                    fontFamily: semibold,
                    fontSize: font(14),
                    minWidth: 28,
                    minHeight: 28,
                    textAlign: 'center',
                    lineHeight: font(28),
                    borderRadius: 14,
                    overflow: 'hidden',
                  }}
                >
                  {String(Number(day))}
                </Text>
              ) : null}
              {m && (m.todo || m.call || m.workshop) ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.spruce, marginTop: 2 }} /> : null}
            </View>
          );
        })}
      </View>
      <Card>
        <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>{fmt(selected)}</Text>
        {agenda.length ? agenda.map((line) => <Body key={line}>{line}</Body>) : <Body muted>Nothing on this day.</Body>}
      </Card>
    </StackScreen>
  );
}
