import { router } from 'expo-router';
import { ACADEMY } from '../data/content';
import { useApp } from '../store/store';
import { Body, Button, Card, Eyebrow, H1, Progress, StackScreen } from '../components/ui';

export default function Academy() {
  const { data, user } = useApp();
  if (!user) return null;
  const done = ACADEMY.filter((_, i) => data.academy.some((a) => a.userId === user.id && a.index === i && a.done)).length;
  return (
    <StackScreen title="Academy">
      <Eyebrow>EmpathyWorks Leadership Academy</Eyebrow>
      <H1>Twelve modules</H1>
      <Body muted>Each one has a summary, objectives, an exercise, three questions and an application. Your progress stays on this phone.</Body>
      <Progress value={done / ACADEMY.length} />
      <Body muted>
        {done} of {ACADEMY.length} complete
      </Body>
      {ACADEMY.map((mod, i) => {
        const row = data.academy.find((a) => a.userId === user.id && a.index === i);
        return (
          <Card key={mod.title}>
            <Body muted>{row?.done ? 'Complete' : 'Module ' + (i + 1)}</Body>
            <H1>{mod.title}</H1>
            <Body>{mod.summary}</Body>
            <Button label="Open" kind="quiet" onPress={() => router.push('/module?n=' + i)} />
          </Card>
        );
      })}
    </StackScreen>
  );
}
