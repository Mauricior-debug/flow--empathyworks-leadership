import { PRIVACY } from '../data/content';
import { Body, H2, StackScreen } from '../components/ui';

export default function Privacy() {
  return (
    <StackScreen title="Privacy">
      <H2>Your privacy</H2>
      {PRIVACY.map((section) => (
        <Body key={section.h}>
          {section.h + '\n\n' + section.paragraphs.join('\n\n')}
        </Body>
      ))}
    </StackScreen>
  );
}
