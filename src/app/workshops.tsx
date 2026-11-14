import { router } from 'expo-router';
import { useState } from 'react';
import { fmt } from '../store/dates';
import { iso } from '../store/dates';
import { isPlus, requestWorkshop } from '../store/logic';
import { TEAM } from '../data/content';
import { useApp } from '../store/store';
import { Body, Button, Card, Field, H1, StackScreen } from '../components/ui';

export default function Workshops() {
  const { data, user, run } = useApp();
  const [topic, setTopic] = useState('');
  const [when, setWhen] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  if (!user) return null;
  const today = iso();
  const upcoming = data.workshops.filter((w) => w.date >= today);
  const mine = data.bookings.filter((b) => b.userId === user.id && b.status === 'booked');
  return (
    <StackScreen title="Workshops">
      <H1>Monthly workshops</H1>
      <Body muted>
        {isPlus(user)
          ? 'Included with Leadership Plus, one each calendar month.'
          : '£35 for Leadership Essentials. Included with Leadership Plus. A practice booking does not charge a card.'}
      </Body>
      <H1>Upcoming</H1>
      {upcoming.map((ws) => {
        const booked = mine.some((b) => b.workshopId === ws.id);
        const who = TEAM.find((t) => t.key === ws.facilitator);
        return (
          <Card key={ws.id}>
            <Body muted>{fmt(ws.date)} · {ws.time}</Body>
            <H1>{ws.title}</H1>
            <Body>{ws.summary}</Body>
            <Body muted>{ws.format} · {who?.name} · {booked ? 'Booked' : ws.places + ' places'}</Body>
            <Button label={booked ? 'View booking' : 'Details'} onPress={() => router.push('/workshop?id=' + ws.id)} />
          </Card>
        );
      })}
      <H1>Booked</H1>
      {mine.length === 0 ? <Body muted>You have not booked a workshop yet.</Body> : null}
      {mine.map((b) => {
        const ws = data.workshops.find((w) => w.id === b.workshopId);
        if (!ws) return null;
        return (
          <Card key={b.id}>
            <Body>{ws.title}</Body>
            <Body muted>{fmt(ws.date)} · {b.practice ? 'Practice booking, £35' : 'Included'}</Body>
          </Card>
        );
      })}
      <H1>Request a workshop</H1>
      {sent ? <Body>Request saved on this phone. The team demo can see it.</Body> : null}
      <Field label="Topic" value={topic} onChangeText={setTopic} />
      <Field label="When" value={when} onChangeText={setWhen} placeholder="A month or a season" />
      <Field label="Notes" value={notes} onChangeText={setNotes} multiline />
      <Button
        label="Send request"
        onPress={() => {
          if (run(requestWorkshop(data, topic, when, notes), 'Request sent.')) setSent(true);
        }}
      />
    </StackScreen>
  );
}
