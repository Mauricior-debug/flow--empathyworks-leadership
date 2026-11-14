import { router } from 'expo-router';
import { EMAIL, FAQS } from '../data/content';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Help() {
  return (
    <StackScreen title="Help">
      <H1>Help and support</H1>
      <Body muted>Questions about the app, on this phone.</Body>
      {FAQS.map((item) => (
        <Card key={item.q}>
          <H1>{item.q}</H1>
          <Body>{item.a}</Body>
        </Card>
      ))}
      <Button label="Contact the team" onPress={() => router.push('/contact')} />
      <Body muted>{EMAIL}</Body>
      <Button label="Privacy policy" kind="secondary" onPress={() => router.push('/privacy')} />
    </StackScreen>
  );
}
