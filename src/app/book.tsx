import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BOOK_TYPES, TEAM, daysAhead } from '../data/content';
import { fmt, iso } from '../store/dates';
import { bookAppointment, freeSlots, isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Chip, H1, StackScreen } from '../components/ui';

export default function Book() {
  const params = useLocalSearchParams<{ kind?: string }>();
  const { data, user, run } = useApp();
  const today = iso();
  const days = useMemo(
    () =>
      daysAhead(today, 45).filter((d) => {
        const diff = (Date.parse(d + 'T12:00:00') - Date.parse(today + 'T12:00:00')) / 86400000;
        return diff > 0 && diff <= 60;
      }),
    [today],
  );
  const [kind, setKind] = useState(params.kind || 'discovery');
  const [who, setWho] = useState<'steve' | 'neil'>('steve');
  const [day, setDay] = useState(days[0] || '');
  const [slot, setSlot] = useState('');
  if (!user) return null;
  const spec = BOOK_TYPES.find((t) => t.id === kind);
  const slots = day ? freeSlots(data, who, day) : [];
  const blocked =
    (spec?.plus && !isPlus(user)) ||
    (kind === 'coaching' && !user.coaching && user.role !== 'admin') ||
    (kind === 'consult' && !user.orgPortal && user.role !== 'admin');
  return (
    <StackScreen
      title="Book"
      footer={
        <Button
          label="Confirm"
          disabled={!slot || blocked}
          onPress={() => {
            const result = bookAppointment(data, kind, who, day, slot);
            if (run(result, 'You are booked.')) router.replace('/appointments');
          }}
        />
      }
    >
      <H1>Choose a conversation</H1>
      <Body muted>A free 30-minute slot in the next 60 days. Confirmed on this phone, with a Zoom link.</Body>
      {BOOK_TYPES.map((type) => (
        <Chip key={type.id} label={type.name} on={kind === type.id} onPress={() => { setKind(type.id); setSlot(''); }} />
      ))}
      {spec ? <Body muted>{spec.detail}</Body> : null}
      {blocked ? <Body>This conversation is not open on your current membership. You can switch from Account or Membership.</Body> : null}
      <Body>With</Body>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {TEAM.map((person) => (
          <View key={person.key} style={{ flex: 1 }}>
            <Chip label={person.name} on={who === person.key} onPress={() => { setWho(person.key); setSlot(''); }} />
          </View>
        ))}
      </View>
      <Body>Day</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {days.map((d) => (
          <Chip key={d} label={fmt(d, { weekday: 'short', day: 'numeric', month: 'short' })} on={day === d} onPress={() => { setDay(d); setSlot(''); }} />
        ))}
      </View>
      <Body>Time</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {slots.map((s) => (
          <Chip key={s} label={s} on={slot === s} onPress={() => setSlot(s)} />
        ))}
      </View>
      {!slots.length ? <Body muted>No free time that day. Try another day.</Body> : null}
    </StackScreen>
  );
}
