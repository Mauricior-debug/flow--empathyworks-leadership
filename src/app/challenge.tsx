import { router } from 'expo-router';
import { useState } from 'react';
import { challengeFor } from '../data/content';
import { fmt, iso, monday } from '../store/dates';
import { isPlus, setChallenge } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Eyebrow, Field, H1, StackScreen } from '../components/ui';

export default function Challenge() {
  const { data, user, run } = useApp();
  const week = monday(iso());
  const challenge = challengeFor(week);
  const log = user ? data.challenges.find((c) => c.userId === user.id && c.week === week) : undefined;
  const [note, setNote] = useState(log?.note || '');
  if (!user) return null;
  if (!isPlus(user)) {
    return (
      <StackScreen title="Challenge">
        <Eyebrow>Leadership Plus</Eyebrow>
        <H1>{challenge.title}</H1>
        <Body>{challenge.body}</Body>
        <Card>
          <Body>A new challenge arrives each Monday. It is part of Leadership Plus, along with the community, the full surveys and every article.</Body>
          <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
        </Card>
      </StackScreen>
    );
  }
  const past = data.challenges.filter((c) => c.userId === user.id && c.week !== week);
  return (
    <StackScreen title="This week">
      <Eyebrow>Week of {fmt(week)}</Eyebrow>
      <H1>{challenge.title}</H1>
      <Body>{challenge.body}</Body>
      <Body muted>{log ? 'Status: ' + log.status : 'Not started.'}</Body>
      <Button label="Accept" onPress={() => run(setChallenge(data, 'accepted', note), 'Challenge accepted.')} />
      <Field label="A note when you complete it" value={note} onChangeText={setNote} multiline />
      <Button label="Mark complete" onPress={() => run(setChallenge(data, 'done', note), 'Marked complete.')} />
      <Button label="Skip this week" kind="secondary" onPress={() => run(setChallenge(data, 'skipped', note), 'Skipped for this week.')} />
      {past.length ? (
        <Card>
          <Body>Earlier weeks</Body>
          {past.map((c) => (
            <Body key={c.week} muted>
              {fmt(c.week)} · {c.status}
              {c.note ? ' · ' + c.note : ''}
            </Body>
          ))}
        </Card>
      ) : null}
    </StackScreen>
  );
}
