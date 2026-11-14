import { router } from 'expo-router';
import { useState } from 'react';
import { resetPassword } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Field, StackScreen } from '../components/ui';

export default function Forgot() {
  const { data, run } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState('');
  return (
    <StackScreen
      title="New password"
      footer={
        <Button
          label="Save password"
          onPress={() => {
            const result = resetPassword(data, email, password, again);
            if (result.error) {
              setError(result.error);
              return;
            }
            run(result, 'Password saved on this phone.');
            router.replace('/sign-in');
          }}
        />
      }
    >
      <Body muted>This sets a new password on this phone. At least 8 characters. Nothing is emailed.</Body>
      {error ? <Body>{error}</Body> : null}
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Field label="New password" value={password} onChangeText={setPassword} secureTextEntry />
      <Field label="Type it again" value={again} onChangeText={setAgain} secureTextEntry />
    </StackScreen>
  );
}
