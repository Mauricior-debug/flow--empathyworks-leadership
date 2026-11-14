import { router } from 'expo-router';
import { useApp } from '../store/store';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Organisation() {
  const { user } = useApp();
  if (!user) return null;
  if (!user.orgPortal && user.role !== 'admin') {
    return (
      <StackScreen title="Organisation">
        <H1>Organisation portal</H1>
        <Body>This opens when your organisation is working with EmpathyWorks. The team links it. Your personal reflections are never shown here.</Body>
        <Button label="Talk to us" onPress={() => router.push('/contact')} />
      </StackScreen>
    );
  }
  return (
    <StackScreen title="Organisation">
      <H1>{user.org || 'Your organisation'}</H1>
      <Body muted>Programmes and the culture survey. Individual answers stay with the person who wrote them. Combined results are described only once at least five people have taken part. This demo does not invent a score.</Body>
      <Card>
        <H1>Programmes</H1>
        <Body>Leadership Development Partner, in conversation.</Body>
        <Body>Monthly workshops for leaders in the organisation.</Body>
        <Body>Culture survey, offered alongside the work.</Body>
        <Button label="Talk about a partnership" onPress={() => router.push('/programmes')} />
      </Card>
      <Card>
        <H1>Culture survey</H1>
        <Body>Trust in leadership, feeling heard, clarity, psychological safety, wellbeing and workload.</Body>
        <Button label="Take the survey" onPress={() => router.push('/survey?which=culture')} />
      </Card>
    </StackScreen>
  );
}
