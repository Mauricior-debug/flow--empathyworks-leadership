import { router } from 'expo-router';
import { CULTURE, DIMS } from '../data/content';
import { fmt } from '../store/dates';
import { isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Eyebrow, H1, StackScreen } from '../components/ui';

export default function Surveys() {
  const { data, user } = useApp();
  if (!user) return null;
  const plus = isPlus(user);
  const lead = data.surveys.find((s) => s.userId === user.id && s.which === 'leadership');
  const culture = data.surveys.find((s) => s.userId === user.id && s.which === 'culture');
  return (
    <StackScreen title="Surveys">
      <Eyebrow>Two surveys</Eyebrow>
      <H1>See where you are</H1>
      <Body muted>
        Essentials sees the first half of each survey. Plus sees the full result. {plus ? 'You are on Plus.' : 'You are on Essentials.'}
      </Body>
      <Card>
        <H1>Leadership Diagnostic</H1>
        <Body>The Mirror themes, scored. {DIMS.length} themes.</Body>
        <Body muted>{lead ? 'Last taken ' + fmt(lead.date) : 'Not taken yet.'}</Body>
        <Button label={lead ? 'Review' : 'Begin'} onPress={() => router.push('/survey?which=leadership')} />
      </Card>
      <Card>
        <H1>Reflection and Culture Survey</H1>
        <Body>Trust in leadership, feeling heard, clarity, psychological safety, wellbeing and workload.</Body>
        <Body muted>{culture ? 'Last taken ' + fmt(culture.date) : 'Not taken yet.'}</Body>
        <Button label={culture ? 'Review' : 'Begin'} onPress={() => router.push('/survey?which=culture')} />
      </Card>
    </StackScreen>
  );
}
