import { useState } from 'react';
import { sendFeedback } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Field, H1, StackScreen } from '../components/ui';

export default function Feedback() {
  const { data, run } = useApp();
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <StackScreen title="Feedback">
      <H1>Send feedback</H1>
      <Body muted>Tell us what is working and what is getting in the way. It stays on this phone, and the team demo can read it.</Body>
      {sent ? <Body>Thank you. It is saved.</Body> : null}
      <Field label="Your note" value={body} onChangeText={setBody} multiline />
      <Button
        label="Send"
        onPress={() => {
          if (run(sendFeedback(data, body), 'Feedback saved.')) setSent(true);
        }}
      />
    </StackScreen>
  );
}
