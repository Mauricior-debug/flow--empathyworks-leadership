import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { EMAIL } from '../data/content';
import { sendContact } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Field, H1, StackScreen } from '../components/ui';

export default function Contact() {
  const { data, user, run, toast } = useApp();
  const [name, setName] = useState(user ? user.first + ' ' + user.last : '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <StackScreen title="Contact">
      <H1>Talk to the EmpathyWorks team</H1>
      <Body muted>The address published on the site is the email below. The privacy note says a registered postal address is still to be added, so this screen does not invent one.</Body>
      {sent ? <Body>Message saved. In this demo it stays on the phone for the team area.</Body> : null}
      <Field label="Your name" value={name} onChangeText={setName} />
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Field label="Your message" value={message} onChangeText={setMessage} multiline />
      <Button
        label="Send message"
        onPress={() => {
          if (run(sendContact(data, name, email, message), 'Message saved.')) setSent(true);
        }}
      />
      <Card>
        <Body>{EMAIL}</Body>
        <Button
          label="Copy email"
          kind="secondary"
          onPress={async () => {
            await Clipboard.setStringAsync(EMAIL);
            toast('Copied.');
          }}
        />
      </Card>
    </StackScreen>
  );
}
