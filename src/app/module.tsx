import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ACADEMY } from '../data/content';
import { saveModule } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Eyebrow, Field, H1, H2, StackScreen } from '../components/ui';

export default function ModuleScreen() {
  const { n } = useLocalSearchParams<{ n?: string }>();
  const index = Math.max(0, Math.min(ACADEMY.length - 1, Number(n || 0)));
  const mod = ACADEMY[index];
  const { data, user, run } = useApp();
  const existing = user ? data.academy.find((a) => a.userId === user.id && a.index === index) : undefined;
  const [reflections, setReflections] = useState<string[]>(existing?.reflections || ['', '', '']);
  const [exercise, setExercise] = useState(existing?.exercise || '');
  const [application, setApplication] = useState(existing?.application || '');
  if (!user) return null;
  const save = (done: boolean) =>
    run(saveModule(data, index, { reflections, exercise, application, done }), done ? 'Module marked complete.' : 'Progress saved.');
  return (
    <StackScreen
      title={'Module ' + (index + 1)}
      footer={
        <>
          <Button label="Save progress" kind="secondary" onPress={() => save(false)} />
          <Button label={existing?.done ? 'Saved as complete' : 'Mark complete'} onPress={() => save(true)} />
        </>
      }
    >
      <Eyebrow>Academy</Eyebrow>
      <H1>{mod.title}</H1>
      <Body>{mod.summary}</Body>
      <Body>{mod.intro}</Body>
      <Card>
        <H2>Objectives</H2>
        {mod.objectives.map((o) => (
          <Body key={o}>{o}</Body>
        ))}
      </Card>
      <Card>
        <H2>Exercise</H2>
        <Body>{mod.exercise}</Body>
        <Field label="Your notes" value={exercise} onChangeText={setExercise} multiline />
      </Card>
      <Card>
        <H2>Three questions</H2>
        {mod.questions.map((q, i) => (
          <Field key={q} label={q} value={reflections[i] || ''} onChangeText={(v) => setReflections(reflections.map((r, idx) => (idx === i ? v : r)))} multiline />
        ))}
      </Card>
      <Card>
        <H2>Application</H2>
        <Body>{mod.application}</Body>
        <Field label="What you will do" value={application} onChangeText={setApplication} multiline />
      </Card>
    </StackScreen>
  );
}
