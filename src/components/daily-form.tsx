import { useState } from 'react';
import { Text, View } from 'react-native';
import { MOODS, SHOWING } from '../data/content';
import { iso } from '../store/dates';
import { saveDaily } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Chip, Field } from './ui';

export function DailyForm() {
  const { data, user, run } = useApp();
  const { c, font, semibold } = useTheme();
  const existing = user ? data.daily.find((d) => d.userId === user.id && d.date === iso()) : undefined;
  const [mood, setMood] = useState(existing?.mood ?? 2);
  const [showing, setShowing] = useState<string[]>(existing?.showing ?? []);
  const [line, setLine] = useState(existing?.line ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  if (!user) return null;
  const toggle = (name: string) => setShowing((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));
  return (
    <View style={{ gap: 16 }}>
      <Body muted>{existing ? 'You can edit this until the end of the day.' : 'About two minutes. Only you see this.'}</Body>
      <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>How are you arriving?</Text>
      <View style={{ gap: 8 }}>
        {MOODS.map((m, i) => (
          <Chip key={m.name} label={m.name} on={mood === i} color={m.color + '33'} onPress={() => setMood(i)} />
        ))}
      </View>
      <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>How are you showing up?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SHOWING.map((name) => (
          <Chip key={name} label={name} on={showing.includes(name)} onPress={() => toggle(name)} />
        ))}
      </View>
      <Field label="Today's challenge, in one line" value={line} onChangeText={setLine} placeholder="One line is enough" />
      <Field label="A note, if you want one" value={note} onChangeText={setNote} multiline placeholder="Optional" />
      <Button
        label={existing ? 'Update reflection' : 'Save reflection'}
        onPress={() => run(saveDaily(data, { mood, showing, line, note }), 'Saved for today.')}
      />
    </View>
  );
}
