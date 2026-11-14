import { router, useLocalSearchParams } from 'expo-router';
import { SERVICES } from '../data/content';
import { Body, Button, H1, StackScreen } from '../components/ui';

export default function Service() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const service = SERVICES.find((s) => s.id === id) || SERVICES[0];
  return (
    <StackScreen title="Service">
      <H1>{service.name}</H1>
      <Body>{service.short}</Body>
      <Body>{service.body}</Body>
      {service.includes.map((item) => (
        <Body key={item}>{item}</Body>
      ))}
      <Button label="Talk to the team" onPress={() => router.push('/contact')} />
    </StackScreen>
  );
}
