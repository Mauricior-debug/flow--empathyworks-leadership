import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { answerAsk, askConsultant, isPlus } from '../store/logic';
import { ago, iso, monday } from '../store/dates';
import { replyFor, useApp } from '../store/store';
import { Body, Button, Card, Field, H1, StackScreen } from '../components/ui';

export default function Ask() {
  const { data, user, set, toast } = useApp();
  const [question, setQuestion] = useState('');
  const mine = user ? data.asks.filter((a) => a.userId === user.id) : [];
  const week = monday(iso());
  const asked = mine.some((a) => monday(a.askedAt.slice(0, 10)) === week);
  useEffect(() => {
    const waiting = mine.find((a) => !a.answer);
    if (!waiting) return;
    const t = setTimeout(() => {
      set((current) => {
        const still = current.asks.find((a) => a.id === waiting.id);
        if (!still || still.answer) return current;
        return answerAsk(current, waiting.id, replyFor(still.question)).data;
      });
      toast('Steve has replied.');
    }, 2200);
    return () => clearTimeout(t);
  }, [mine.map((a) => a.id + (a.answer ? '1' : '0')).join('|')]);
  if (!user) return null;
  if (!isPlus(user)) {
    return (
      <StackScreen title="Ask">
        <H1>One question a week</H1>
        <Body>Asking a consultant is part of Leadership Plus. You still have the articles, the Mirror and the team message thread.</Body>
        <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
      </StackScreen>
    );
  }
  return (
    <StackScreen title="Ask a consultant">
      <H1>One question this week</H1>
      <Body muted>Plus members can ask one question a week. The answer appears here when it arrives.</Body>
      {asked ? <Body>You have used this week’s question.</Body> : null}
      {!asked ? (
        <>
          <Field label="Your question" value={question} onChangeText={setQuestion} multiline />
          <Button
            label="Send question"
            onPress={() => {
              const result = askConsultant(data, question);
              if (result.error) {
                toast(result.error);
                return;
              }
              set(result.data);
              setQuestion('');
              toast('Sent. The answer will appear here.');
            }}
          />
        </>
      ) : null}
      {mine.map((item) => (
        <Card key={item.id}>
          <Body muted>{ago(item.askedAt)}</Body>
          <Body>{item.question}</Body>
          {item.answer ? (
            <>
              <Body muted>{item.from} · {item.answeredAt ? ago(item.answeredAt) : ''}</Body>
              <Body>{item.answer}</Body>
            </>
          ) : (
            <Body muted>Waiting for an answer.</Body>
          )}
        </Card>
      ))}
    </StackScreen>
  );
}
