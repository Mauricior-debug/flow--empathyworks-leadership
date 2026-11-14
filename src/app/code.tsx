import { router } from 'expo-router';
import { useState } from 'react';
import { DEMO_CODE } from '../data/content';
import { signInCode } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Field, StackScreen } from '../components/ui';

export default function Code() {
  const { data, run } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const email = data.pendingCodeEmail;
  return (
    <StackScreen
      title="Sign-in code"
      footer={
        <Button
          label="Sign in"
          onPress={() => {
            const result = signInCode(data, code);
            if (result.error) {
              setError(result.error);
              return;
            }
            run(result);
            const user = result.data.people.find((p) => p.id === result.data.sessionUserId);
            router.replace(user && !user.onboarded ? '/onboarding' : '/(tabs)/home');
          }}
        />
      }
    >
      <Body muted>No email is sent from this demo. The code is shown here.</Body>
      <Card>
        <Body>Code for {email || 'your email'}</Body>
        <Body>{DEMO_CODE}</Body>
      </Card>
      {error ? <Body>{error}</Body> : null}
      <Field label="6-digit code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
    </StackScreen>
  );
}
