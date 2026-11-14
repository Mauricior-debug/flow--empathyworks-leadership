import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { MOODS } from '../data/content';
import { deleteJournal, saveJournal } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Chip, Field, StackScreen } from '../components/ui';

export default function JournalEdit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user, run, set, sheet } = useApp();
  const existing = data.journal.find((j) => j.id === id && j.userId === user?.id);
  const [body, setBody] = useState(existing?.body || '');
  const [mood, setMood] = useState<number | null>(existing?.mood ?? null);
  const [flag, setFlag] = useState(existing?.forSession || false);
  if (!user) return null;
  return (
    <StackScreen
      title={existing ? 'Edit entry' : 'New entry'}
      footer={
        <Button
          label="Save entry"
          onPress={() => {
            const result = saveJournal(data, { id: existing?.id, body, mood, forSession: flag });
            if (run(result, 'Journal saved.')) router.back();
          }}
        />
      }
    >
      <Body muted>Only you can read this, unless you flag it for coaching.</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {MOODS.map((m, i) => (
          <Chip key={m.name} label={m.name} on={mood === i} onPress={() => setMood(mood === i ? null : i)} />
        ))}
      </View>
      <Field label="What do you want to keep?" value={body} onChangeText={setBody} multiline />
      <Chip label={flag ? 'Flagged for the next session' : 'Bring this to the next session'} on={flag} onPress={() => setFlag(!flag)} />
      {existing ? (
        <Button
          label="Delete entry"
          kind="danger"
          onPress={() =>
            sheet({
              title: 'Delete this entry?',
              message: 'It is removed from this phone.',
              confirmLabel: 'Delete',
              danger: true,
              onConfirm: () => {
                set(deleteJournal(data, existing.id));
                router.back();
              },
            })
          }
        />
      ) : null}
    </StackScreen>
  );
}
