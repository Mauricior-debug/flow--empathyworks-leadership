import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { BOOK_TYPES, TEAM } from '../data/content';
import { fmt } from '../store/dates';
import { cancelAppointment } from '../store/logic';
import { iso as todayIso } from '../store/dates';
import { useApp } from '../store/store';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Appointments() {
  const { data, user, set, sheet, toast } = useApp();
  if (!user) return null;
  const today = todayIso();
  const mine = data.appointments.filter((a) => a.userId === user.id && a.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot));
  return (
    <StackScreen title="Appointments" footer={<Button label="Book a time" onPress={() => router.push('/book')} />}>
      <H1>Optional calls</H1>
      <Body muted>Thirty minutes, on a weekday in the next 60 days, with Steve Robertson or Neil Lavis. Nothing is compulsory.</Body>
      {mine.length === 0 ? <Body muted>No calls booked.</Body> : null}
      {mine.map((appt) => {
        const type = BOOK_TYPES.find((t) => t.id === appt.kind);
        const who = TEAM.find((t) => t.key === appt.withKey);
        const past = appt.date < today;
        return (
          <Card key={appt.id}>
            <Body muted>{past ? 'Past' : 'Confirmed'}</Body>
            <H1>{type?.name || 'Appointment'}</H1>
            <Body>{fmt(appt.date)} at {appt.slot} · 30 minutes</Body>
            <Body muted>with {who?.name}</Body>
            {!past ? <Button label="Open Zoom link" kind="secondary" onPress={() => Linking.openURL(appt.zoom)} /> : null}
            {!past ? (
              <Button
                label="Cancel"
                kind="danger"
                onPress={() =>
                  sheet({
                    title: 'Cancel this appointment?',
                    message: 'The time goes back on the calendar.',
                    confirmLabel: 'Cancel appointment',
                    danger: true,
                    onConfirm: () => {
                      set(cancelAppointment(data, appt.id));
                      toast('Cancelled.');
                    },
                  })
                }
              />
            ) : null}
          </Card>
        );
      })}
    </StackScreen>
  );
}
