import { CHANGELOG } from '../data/content';
import { Body, Card, H1, StackScreen } from '../components/ui';

export default function WhatsNew() {
  return (
    <StackScreen title="What's new">
      <H1>What has changed</H1>
      {CHANGELOG.map((entry) => (
        <Card key={entry.id}>
          <Body muted>{entry.date}</Body>
          <H1>{entry.title}</H1>
          {entry.items.map((item) => (
            <Body key={item}>{item}</Body>
          ))}
        </Card>
      ))}
    </StackScreen>
  );
}
