import { router } from 'expo-router';
import { useState } from 'react';
import { PRIVACY } from '../data/content';
import { createAccount } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Field, StackScreen } from '../components/ui';

export default function CreateAccount() {
  const { data, run, sheet } = useApp();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [job, setJob] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const result = createAccount(data, { first, last, email, password, org, job, phone });
    if (result.error) {
      setError(result.error);
      return;
    }
    run(result, 'Account created on this phone.');
    router.replace('/onboarding');
  };

  return (
    <StackScreen
      title="Create account"
      footer={<Button label="Create account" onPress={submit} />}
    >
      <Body muted>Leadership Essentials is free. We use your first name around the app. Nothing leaves this phone.</Body>
      {error ? <Body style={{ color: '#A33B32' }}>{error}</Body> : null}
      <Field label="First name" value={first} onChangeText={setFirst} autoComplete="given-name" />
      <Field label="Last name" value={last} onChangeText={setLast} autoComplete="family-name" />
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" hint="At least 8 characters." />
      <Field label="Organisation" value={org} onChangeText={setOrg} />
      <Field label="Job" value={job} onChangeText={setJob} />
      <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button
        label="Privacy policy"
        kind="quiet"
        onPress={() =>
          sheet({
            title: 'Privacy policy',
            message: PRIVACY.map((s) => s.h + '\n\n' + s.paragraphs.join('\n\n')).join('\n\n'),
            confirmLabel: 'Close',
            cancelLabel: '',
          })
        }
      />
    </StackScreen>
  );
}
