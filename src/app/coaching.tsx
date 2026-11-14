import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { BOOK_TYPES, TEAM } from '../data/content';
import { fmt, iso } from '../store/dates';
import { saveBlueprint, setAction, setObjectiveProgress } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Chip, Field, H1, StackScreen } from '../components/ui';

export default function Coaching() {
  const { data, user, run, set } = useApp();
  const blueprint = user ? data.blueprints.find((b) => b.userId === user.id) : undefined;
  const [leader, setLeader] = useState(blueprint?.leader || '');
  const [behaviours, setBehaviours] = useState(blueprint?.behaviours || '');
  const [help, setHelp] = useState(blueprint?.help || '');
  const [check, setCheck] = useState<Record<string, string>>({});
  if (!user) return null;
  if (!user.coaching && user.role !== 'admin') {
    return (
      <StackScreen title="Coaching">
        <H1>Coaching hub</H1>
        <Body>This opens when you are on the Leadership Coaching Programme. Talk to the team and they will link it on this phone.</Body>
        <Button label="Talk to us" onPress={() => router.push('/contact')} />
      </StackScreen>
    );
  }
  const next = data.appointments
    .filter((a) => a.userId === user.id && a.kind === 'coaching' && a.status === 'confirmed' && a.date >= iso())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const who = next ? TEAM.find((t) => t.key === next.withKey) : undefined;
  const notes = data.notes.filter((n) => n.userId === user.id);
  const objectives = data.objectives.filter((o) => o.userId === user.id);
  const actions = data.actions.filter((a) => a.userId === user.id);
  return (
    <StackScreen title="Coaching hub">
      <H1>Your coaching</H1>
      <Card>
        <Body muted>Next session</Body>
        <H1>{next ? fmt(next.date) + ', ' + next.slot : 'Not booked yet'}</H1>
        <Body muted>{who ? 'with ' + who.name : BOOK_TYPES.find((t) => t.id === 'coaching')?.detail}</Body>
        <Button label={next ? 'See appointments' : 'Book a check-in'} onPress={() => router.push(next ? '/appointments' : '/book?kind=coaching')} />
      </Card>
      <H1>Notes</H1>
      {notes.map((note) => (
        <Card key={note.id}>
          <Body muted>{fmt(note.date)}</Body>
          <Body>{note.body}</Body>
        </Card>
      ))}
      <H1>Objectives</H1>
      {objectives.map((objective) => (
        <Card key={objective.id}>
          <Body>{objective.title}</Body>
          <Body muted>{objective.progress}%</Body>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[0, 20, 40, 60, 80, 100].map((n) => (
              <Chip key={n} label={String(n)} on={objective.progress === n} onPress={() => set(setObjectiveProgress(data, objective.id, n))} />
            ))}
          </View>
        </Card>
      ))}
      <H1>Actions</H1>
      {actions.map((action) => (
        <Card key={action.id}>
          <Body>{action.title}</Body>
          <Chip label={action.done ? 'Done' : 'Mark done'} on={action.done} onPress={() => run(setAction(data, action.id, { done: !action.done }))} />
          <Field label="Check in" value={check[action.id] ?? action.checkIn} onChangeText={(v) => setCheck({ ...check, [action.id]: v })} />
          <Button label="Save check-in" kind="secondary" onPress={() => run(setAction(data, action.id, { checkIn: check[action.id] ?? action.checkIn }), 'Check-in saved.')} />
        </Card>
      ))}
      <H1>Blueprint</H1>
      <Body muted>The leader I want to be, the behaviours, and where I will ask for help.</Body>
      <Field label="The leader I want to be" value={leader} onChangeText={setLeader} multiline />
      <Field label="Behaviours" value={behaviours} onChangeText={setBehaviours} multiline />
      <Field label="Where I will ask for help" value={help} onChangeText={setHelp} multiline />
      <Button label="Save blueprint" onPress={() => run(saveBlueprint(data, { leader, behaviours, help }), 'Blueprint saved.')} />
    </StackScreen>
  );
}
