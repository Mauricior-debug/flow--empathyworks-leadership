import { router } from 'expo-router';
import { useState } from 'react';
import { deleteAccount } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Field, H1, StackScreen } from '../components/ui';

export default function DeleteAccount() {
  const { data, run } = useApp();
  const [typed, setTyped] = useState('');
  return (
    <StackScreen title="Delete account">
      <H1>Delete this account</H1>
      <Body>This removes the account and what it saved on this phone. Type DELETE to confirm.</Body>
      <Field label="Type DELETE" value={typed} onChangeText={setTyped} autoCapitalize="characters" />
      <Button
        label="Delete account"
        kind="danger"
        disabled={typed.trim() !== 'DELETE'}
        onPress={() => {
          const result = deleteAccount(data, typed);
          if (run(result, 'Account deleted.')) router.replace('/welcome');
        }}
      />
    </StackScreen>
  );
}
