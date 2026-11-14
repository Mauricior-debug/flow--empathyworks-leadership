import { router } from 'expo-router';
import { useState } from 'react';
import { Body, Button, Chip, H1, StackScreen } from '../components/ui';

const QUESTIONS = [
  { q: 'Where is the challenge sitting?', options: ['With me, as a leader', 'With my team', 'Across the organisation', "I'm not sure yet"] },
  { q: "What kind of support feels right?", options: ['A conversation', 'A workshop', 'A longer partnership'] },
];

export default function Guide() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const page = QUESTIONS[step];
  const finish = choice || '';
  return (
    <StackScreen title="Where to start">
      <H1>{step < QUESTIONS.length ? page.q : 'A place to start'}</H1>
      {step < QUESTIONS.length ? (
        <>
          {page.options.map((option) => (
            <Chip key={option} label={option} on={choice === option} onPress={() => setChoice(option)} />
          ))}
          <Button
            label={step === QUESTIONS.length - 1 ? 'See a suggestion' : 'Next'}
            disabled={!choice}
            onPress={() => {
              if (step === QUESTIONS.length - 1) setStep(step + 1);
              else {
                setStep(step + 1);
                setChoice(null);
              }
            }}
          />
        </>
      ) : (
        <>
          <Body>
            {finish.includes('organisation') || finish.includes('partnership')
              ? 'Start with a conversation about an organisational partnership.'
              : finish.includes('workshop') || finish.includes('team')
                ? 'Look at the monthly workshops, or ask for one in-house.'
                : 'A Leadership Conversation is a good first step. It is optional, and you can book it in the app.'}
          </Body>
          <Button label="Book a Leadership Conversation" onPress={() => router.push('/book?kind=discovery')} />
          <Button label="See programmes" kind="secondary" onPress={() => router.push('/programmes')} />
        </>
      )}
    </StackScreen>
  );
}
