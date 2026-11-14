import { DailyForm } from '../components/daily-form';
import { Body, Eyebrow, H1, StackScreen } from '../components/ui';

export default function Daily() {
  return (
    <StackScreen title="Daily reflection">
      <Eyebrow>Today</Eyebrow>
      <H1>Two minutes</H1>
      <Body muted>Five moods. How you are showing up. One line for the challenge. A note if you want one.</Body>
      <DailyForm />
    </StackScreen>
  );
}
