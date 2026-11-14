import { router } from 'expo-router';
import { ORG_TIERS, SERVICES } from '../data/content';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Programmes() {
  return (
    <StackScreen title="Programmes">
      <H1>Ways to work with us</H1>
      <Body muted>Coaching and the Academy are arranged by talking with the team. There is no checkout here. Organisation partnerships are priced plus VAT.</Body>
      <Card>
        <H1>Leadership Coaching Programme</H1>
        <Body>Bespoke one-to-one coaching with the EmpathyWorks team. Diagnostic, a discovery session, coaching, and a Personal Leadership Blueprint.</Body>
        <Button label="Talk to us" onPress={() => router.push('/contact')} />
      </Card>
      <Card>
        <H1>EmpathyWorks Leadership Academy</H1>
        <Body>The 12-module programme for leaders who coach. Modules are in the app. A place on the programme starts with a conversation.</Body>
        <Button label="Talk to us" kind="secondary" onPress={() => router.push('/contact')} />
      </Card>
      <H1>For organisations</H1>
      {ORG_TIERS.map((tier) => (
        <Card key={tier.name}>
          <H1>{tier.name}</H1>
          <Body>{tier.price} a month, plus VAT</Body>
          <Body>{tier.tag}</Body>
          {tier.includes.map((item) => (
            <Body key={item}>{item}</Body>
          ))}
          <Button label="Talk to us" kind="secondary" onPress={() => router.push('/contact')} />
        </Card>
      ))}
      <H1>Also from EmpathyWorks</H1>
      {SERVICES.map((service) => (
        <Card key={service.id}>
          <H1>{service.name}</H1>
          <Body>{service.short}</Body>
          <Body muted>{service.body}</Body>
          <Button label="Read more" kind="quiet" onPress={() => router.push('/service?id=' + service.id)} />
        </Card>
      ))}
    </StackScreen>
  );
}
