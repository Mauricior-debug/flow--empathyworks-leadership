import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { MOODS } from '../data/content';
import { ago } from '../store/dates';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Field, StackScreen } from '../components/ui';

export default function Journal() {
  const { data, user } = useApp();
  const { c, font, semibold } = useTheme();
  const [q, setQ] = useState('');
  if (!user) return null;
  const items = data.journal
    .filter((j) => j.userId === user.id)
    .filter((j) => !q.trim() || j.body.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <StackScreen title="Journal" footer={<Button label="New entry" onPress={() => router.push('/journal-edit')} />}>
      <Body muted>Private. Tick a note if you want it in your next coaching session.</Body>
      <Field label="Search" value={q} onChangeText={setQ} placeholder="A word you wrote" />
      {items.length === 0 ? <Body muted>No entries yet.</Body> : null}
      {items.map((entry) => (
        <Card key={entry.id}>
          <Text style={{ color: c.muted, fontFamily: semibold, fontSize: font(13) }}>
            {ago(entry.at)}
            {entry.mood != null ? ' · ' + MOODS[entry.mood].name : ''}
            {entry.forSession ? ' · For the next session' : ''}
          </Text>
          <Body>{entry.body}</Body>
          <Button label="Edit" kind="secondary" onPress={() => router.push('/journal-edit?id=' + entry.id)} />
        </Card>
      ))}
    </StackScreen>
  );
}
