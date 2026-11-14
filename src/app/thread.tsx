import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { openMemberThread, blockPerson, byId, fullName, isPlus, report, sendMessage } from '../store/logic';
import { useApp } from '../store/store';
import { ago } from '../store/dates';
import { Body, Button, Card, Field, H1, StackScreen } from '../components/ui';

export default function ThreadScreen() {
  const params = useLocalSearchParams<{ id?: string; with?: string }>();
  const { data, user, run, set, sheet, toast } = useApp();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!params.with) return;
    set((current) => {
      const person = current.people.find((p) => p.id === current.sessionUserId);
      if (!person || !isPlus(person)) return current;
      const exists = current.threads.some((t) => !t.team && t.memberIds.includes(person.id) && t.memberIds.includes(params.with!));
      if (exists) return current;
      const opened = openMemberThread(current, params.with!);
      return opened.error ? current : opened.data;
    });
  }, [params.with, set]);
  if (!user) return null;
  const thread =
    data.threads.find((t) => t.id === params.id) ||
    data.threads.find((t) => params.with && !t.team && t.memberIds.includes(user.id) && t.memberIds.includes(params.with));
  if (!thread) return <StackScreen title="Message"><Body>That conversation is not here.</Body></StackScreen>;
  const otherId = thread.memberIds.find((id) => id !== user.id);
  const other = otherId ? byId(data, otherId) : undefined;
  return (
    <StackScreen
      title={thread.team ? 'EmpathyWorks team' : thread.title}
      footer={
        <Button
          label="Send"
          onPress={() => {
            if (run(sendMessage(data, thread.id, text), 'Sent.')) setText('');
          }}
        />
      }
    >
      <H1>{thread.team ? 'EmpathyWorks team' : other ? fullName(other) : thread.title}</H1>
      {thread.messages.map((message) => {
        const who = byId(data, message.senderId);
        const mine = message.senderId === user.id;
        return (
          <Card key={message.id}>
            <Body muted>{mine ? 'You' : who ? fullName(who) : 'Member'} · {ago(message.at)}</Body>
            <Body>{message.body}</Body>
          </Card>
        );
      })}
      <Field label="Message" value={text} onChangeText={setText} multiline />
      <Button
        label="Report"
        kind="secondary"
        onPress={() =>
          sheet({
            title: 'Report this conversation?',
            message: 'The team reviews reports within one working day.',
            confirmLabel: 'Report',
            onConfirm: () => run(report(data, thread.id, 'Conversation'), 'Reported.'),
          })
        }
      />
      {other && !thread.team ? (
        <Button
          label={'Block ' + other.first}
          kind="danger"
          onPress={() =>
            sheet({
              title: 'Block ' + fullName(other) + '?',
              confirmLabel: 'Block',
              danger: true,
              message: 'Their posts and messages will be hidden on this phone.',
              onConfirm: () => {
                set(blockPerson(data, other.id));
                toast('Blocked.');
                router.back();
              },
            })
          }
        />
      ) : null}
    </StackScreen>
  );
}
