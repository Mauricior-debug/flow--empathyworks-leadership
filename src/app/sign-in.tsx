import { router } from 'expo-router';
import { useState } from 'react';
import { DEMO } from '../store/seed';
import { beginCode, signInPassword } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Field, StackScreen } from '../components/ui';

export default function SignIn() {
  const { data, run, set } = useApp();
  const [email, setEmail] = useState(DEMO.jordan.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const go = (result: ReturnType<typeof signInPassword>) => {
    if (result.error) {
      setError(result.error);
      return;
    }
    run(result);
    const user = result.data.people.find((p) => p.id === result.data.sessionUserId);
    router.replace(user && !user.onboarded ? '/onboarding' : '/(tabs)/home');
  };

  return (
    <StackScreen title="Sign in" footer={<Button label="Sign in" onPress={() => go(signInPassword(data, email, password))} />}>
      <Body muted>Sign in with the email and password saved on this phone.</Body>
      {error ? <Body>{error}</Body> : null}
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="username" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
      <Button
        label="Email me a code instead"
        kind="quiet"
        onPress={() => {
          const result = beginCode(data, email);
          if (result.error) {
            setError(result.error);
            return;
          }
          set(result.data);
          router.push('/code');
        }}
      />
      <Button label="Forgot your password?" kind="quiet" onPress={() => router.push('/forgot')} />
      <Card>
        <Body>On this phone, Jordan Hale is already a Plus member. Password leadwell. The team demo is info@leadershipconsultant.co.uk, same password.</Body>
        <Button label="Team demo, Steve Robertson" kind="secondary" onPress={() => go(signInPassword(data, DEMO.steve.email, DEMO.steve.password))} />
      </Card>
    </StackScreen>
  );
}
