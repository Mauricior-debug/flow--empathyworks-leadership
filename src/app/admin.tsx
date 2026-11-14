import { useState } from 'react';
import { ARTICLES } from '../data/content';
import { fmt } from '../store/dates';
import { adminMembership, announce, answerAsk, fullName, setArticlePublished } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Chip, Field, H1, StackScreen } from '../components/ui';

export default function Admin() {
  const { data, user, run, set } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tab, setTab] = useState<'Members' | 'Articles' | 'Workshops' | 'Announcements' | 'Bookings'>('Members');
  if (!user || user.role !== 'admin') {
    return (
      <StackScreen title="Team">
        <H1>Team only</H1>
        <Body>Sign in as the team demo to manage members, articles, workshops, announcements and bookings. It writes to the same save on this phone.</Body>
      </StackScreen>
    );
  }
  return (
    <StackScreen title="Manage">
      <H1>Manage the app</H1>
      <Body muted>Announcements are ad-free. Changes stay on this phone.</Body>
      <ViewChips tab={tab} setTab={setTab} />
      {tab === 'Members'
        ? data.people
            .filter((p) => p.password)
            .map((person) => (
              <Card key={person.id}>
                <Body>{fullName(person)}</Body>
                <Body muted>{person.email} · {person.role === 'admin' ? 'Team' : person.membership}</Body>
                {person.role !== 'admin' ? (
                  <Button
                    label={person.membership === 'plus' ? 'Set Essentials' : 'Set Plus'}
                    kind="secondary"
                    onPress={() => set(adminMembership(data, person.id, person.membership === 'plus' ? 'essentials' : 'plus'))}
                  />
                ) : null}
              </Card>
            ))
        : null}
      {tab === 'Articles'
        ? ARTICLES.map((article) => (
            <Card key={article.id}>
              <Body>{article.n}</Body>
              <Body muted>{article.id === 'B1' ? 'Free' : 'Plus'} · {data.articlePublished[article.id] === false ? 'Hidden' : 'Published'}</Body>
              <Button
                label={data.articlePublished[article.id] === false ? 'Publish' : 'Hide'}
                kind="secondary"
                onPress={() => set(setArticlePublished(data, article.id, data.articlePublished[article.id] === false))}
              />
            </Card>
          ))
        : null}
      {tab === 'Workshops'
        ? data.workshops.map((ws) => {
            const booked = data.bookings.filter((b) => b.workshopId === ws.id && b.status === 'booked').length;
            return (
              <Card key={ws.id}>
                <Body>{ws.title}</Body>
                <Body muted>{fmt(ws.date)} · {booked} booked · {ws.places} places</Body>
              </Card>
            );
          })
        : null}
      {tab === 'Announcements' ? (
        <>
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Field label="Message" value={body} onChangeText={setBody} multiline />
          <Button
            label="Publish announcement"
            onPress={() => {
              if (run(announce(data, title, body), 'Announcement published.')) {
                setTitle('');
                setBody('');
              }
            }}
          />
          {data.announcements.map((item) => (
            <Card key={item.id}>
              <Body>{item.title}</Body>
              <Body muted>{item.body}</Body>
            </Card>
          ))}
        </>
      ) : null}
      {tab === 'Bookings' ? (
        <>
          {data.appointments.filter((a) => a.status === 'confirmed').map((a) => {
            const person = data.people.find((p) => p.id === a.userId);
            return (
              <Card key={a.id}>
                <Body>{person ? fullName(person) : 'Member'} · {a.kind}</Body>
                <Body muted>{fmt(a.date)} · {a.slot} · {a.withKey}</Body>
              </Card>
            );
          })}
          {data.bookings.filter((b) => b.status === 'booked').map((b) => {
            const ws = data.workshops.find((w) => w.id === b.workshopId);
            const person = data.people.find((p) => p.id === b.userId);
            return (
              <Card key={b.id}>
                <Body>{person ? fullName(person) : 'Member'}</Body>
                <Body muted>{ws?.title} · {b.practice ? 'Practice £35' : 'Included'}</Body>
              </Card>
            );
          })}
          {data.asks.filter((a) => !a.answer).map((a) => (
            <Card key={a.id}>
              <Body>Unanswered question</Body>
              <Body>{a.question}</Body>
              <Button label="Answer in Steve’s voice" kind="secondary" onPress={() => run(answerAsk(data, a.id, 'Name the standard, stay for the person, and choose the opening line before you begin.'), 'Answer saved.')} />
            </Card>
          ))}
          {data.requests.map((r) => (
            <Card key={r.id}>
              <Body>Workshop request · {r.topic}</Body>
              <Body muted>{r.when} {r.notes}</Body>
            </Card>
          ))}
          {data.feedback.map((f) => (
            <Card key={f.id}>
              <Body>Feedback</Body>
              <Body muted>{f.body}</Body>
            </Card>
          ))}
        </>
      ) : null}
    </StackScreen>
  );
}

function ViewChips({
  tab,
  setTab,
}: {
  tab: 'Members' | 'Articles' | 'Workshops' | 'Announcements' | 'Bookings';
  setTab: (t: 'Members' | 'Articles' | 'Workshops' | 'Announcements' | 'Bookings') => void;
}) {
  const tabs = ['Members', 'Articles', 'Workshops', 'Announcements', 'Bookings'] as const;
  return (
    <>
      {tabs.map((name) => (
        <Chip key={name} label={name} on={tab === name} onPress={() => setTab(name)} />
      ))}
    </>
  );
}
