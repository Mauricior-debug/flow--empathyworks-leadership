import { router } from 'expo-router';
import { byId, fullName, isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Messages() {
  const { data, user } = useApp();
  if (!user) return null;
  const plus = isPlus(user);
  const threads = data.threads.filter((t) => t.memberIds.includes(user.id) || t.team);
  const others = data.people.filter((p) => p.id !== user.id && p.password !== undefined && !p.teamKey && p.id !== 'u-neil');
  return (
    <StackScreen title="Messages">
      <H1>Conversations</H1>
      <Body muted>Everyone can write to the EmpathyWorks team. Messages with other members are part of Leadership Plus.</Body>
      {threads.filter((t) => t.team || plus).map((thread) => {
        const last = thread.messages[thread.messages.length - 1];
        return (
          <Card key={thread.id}>
            <H1>{thread.team ? 'EmpathyWorks team' : thread.title}</H1>
            <Body muted>{last ? last.body : 'No messages yet.'}</Body>
            <Button label="Open" onPress={() => router.push('/thread?id=' + thread.id)} />
          </Card>
        );
      })}
      {plus ? (
        <>
          <Body>Start a conversation</Body>
          {others.map((person) => (
            <Card key={person.id}>
              <Body>{fullName(person)}</Body>
              <Body muted>{person.showJob ? person.job : ''}</Body>
              <Button
                label="Message"
                kind="secondary"
                onPress={() => {
                  const existing = data.threads.find((t) => !t.team && t.memberIds.includes(user.id) && t.memberIds.includes(person.id));
                  if (existing) router.push('/thread?id=' + existing.id);
                  else router.push('/thread?with=' + person.id);
                }}
              />
            </Card>
          ))}
        </>
      ) : (
        <Card>
          <Body>Member messages unlock with Leadership Plus. The team thread stays open.</Body>
          <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
        </Card>
      )}
      {byId(data, user.id) ? null : null}
    </StackScreen>
  );
}
