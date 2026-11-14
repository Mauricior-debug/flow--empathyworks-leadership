import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { finishOnboarding } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Eyebrow, H1, StackScreen } from '../components/ui';

const steps = [
  {
    eyebrow: 'EmpathyWorks',
    title: 'A place for the hard days',
    body: 'EmpathyWorks Leadership Consultancy helps people lead well in hard places. Leadership matters most when things are difficult. This app is where the support carries on between conversations. Two minutes a day is enough to start noticing how you are showing up.',
  },
  {
    eyebrow: 'What is here',
    title: 'Five ways to stay honest',
    body: 'A daily reflection. The Leadership Mirror, once a week. Leadership Articles in Steve’s words. The Leadership Diagnostic. And monthly workshops with other leaders.',
  },
  {
    eyebrow: 'Your first week',
    title: 'Start small',
    body: 'Introduce yourself when you are ready. Book a consultation if you want one. Book this month’s workshop. Take the diagnostic. You will find these on Home, and you can hide the list.',
  },
];

export default function Onboarding() {
  const { data, set } = useApp();
  const { c } = useTheme();
  const [step, setStep] = useState(0);
  const page = steps[step];
  const done = () => {
    set(finishOnboarding(data));
    router.replace('/(tabs)/home');
  };
  return (
    <StackScreen
      title="Welcome"
      footer={
        step < steps.length - 1 ? (
          <View style={{ gap: 8 }}>
            <Button label="Next" onPress={() => setStep(step + 1)} />
            <Button label="Skip" kind="quiet" onPress={done} />
          </View>
        ) : (
          <Button label="Let's get started" onPress={done} />
        )
      }
    >
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {steps.map((_, i) => (
          <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === step ? c.spruce : c.line }} />
        ))}
      </View>
      <Card>
        <Eyebrow>{page.eyebrow}</Eyebrow>
        <H1>{page.title}</H1>
        <Body>{page.body}</Body>
      </Card>
    </StackScreen>
  );
}
