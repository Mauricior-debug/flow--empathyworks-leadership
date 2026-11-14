import { useState } from 'react';
import { savePlanner } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Field, H1, StackScreen } from '../components/ui';

export default function Planner() {
  const { data, user, run } = useApp();
  const existing = user ? data.planners.find((p) => p.userId === user.id) : undefined;
  const [issue, setIssue] = useState(existing?.issue || '');
  const [good, setGood] = useState(existing?.good || '');
  const [they, setThey] = useState(existing?.they || '');
  const [opening, setOpening] = useState(existing?.opening || '');
  if (!user) return null;
  return (
    <StackScreen
      title="Planner"
      footer={<Button label="Save plan" onPress={() => run(savePlanner(data, { issue, good, they, opening }), 'Plan saved on this phone.')} />}
    >
      <H1>The conversation you have been putting off</H1>
      <Body muted>Four lines. You can come back and edit them.</Body>
      <Field label="The issue, in one sentence" value={issue} onChangeText={setIssue} />
      <Field label="What good looks like" value={good} onChangeText={setGood} multiline />
      <Field label="What they might say" value={they} onChangeText={setThey} multiline />
      <Field label="Your opening line" value={opening} onChangeText={setOpening} multiline />
    </StackScreen>
  );
}
