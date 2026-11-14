import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { TEAM, WORKSHOP_PRICE, ZOOM } from '../data/content';
import { fmt } from '../store/dates';
import { bookWorkshop, cancelBooking, isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, H1, StackScreen } from '../components/ui';

export default function Workshop() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user, run, set, sheet, toast } = useApp();
  const ws = data.workshops.find((w) => w.id === id);
  if (!user || !ws) return <StackScreen title="Workshop"><Body>That workshop is not listed.</Body></StackScreen>;
  const booking = data.bookings.find((b) => b.userId === user.id && b.workshopId === ws.id && b.status === 'booked');
  const who = TEAM.find((t) => t.key === ws.facilitator);
  const plus = isPlus(user);
  const taken = data.bookings.filter((b) => b.workshopId === ws.id && b.status === 'booked').length;
  return (
    <StackScreen title="Workshop">
      <Body muted>{fmt(ws.date)} · {ws.time}</Body>
      <H1>{ws.title}</H1>
      <Body>{ws.summary}</Body>
      <Body muted>{ws.format} · with {who?.name} · {taken} of {ws.places} booked</Body>
      <Body muted>{plus ? 'Included with Leadership Plus, one workshop each calendar month.' : '£' + WORKSHOP_PRICE + ' for Leadership Essentials.'}</Body>
      {booking ? (
        <>
          <Body>You are booked.{booking.practice ? ' This was a practice booking. No card was charged.' : ' This place is included.'}</Body>
          {ws.format.includes('Zoom') ? <Button label="Open Zoom link" onPress={() => Linking.openURL(ZOOM)} /> : <Body muted>We will meet in Taunton.</Body>}
          <Button
            label="Cancel booking"
            kind="danger"
            onPress={() =>
              sheet({
                title: 'Cancel this workshop?',
                message: 'Your place goes back to the list on this phone.',
                confirmLabel: 'Cancel booking',
                danger: true,
                onConfirm: () => {
                  set(cancelBooking(data, ws.id));
                  toast('Booking cancelled.');
                },
              })
            }
          />
        </>
      ) : plus ? (
        <Button label="Book · Included" onPress={() => run(bookWorkshop(data, ws.id, false), 'You are booked.')} />
      ) : (
        <Button
          label={'Book · £' + WORKSHOP_PRICE}
          onPress={() =>
            sheet({
              title: 'Practice booking',
              message: 'This workshop is £' + WORKSHOP_PRICE + ' for Leadership Essentials. On this phone it is a practice booking. No card is charged.',
              confirmLabel: 'Book this workshop',
              onConfirm: () => run(bookWorkshop(data, ws.id, true), 'Booked. No card was charged.'),
            })
          }
        />
      )}
    </StackScreen>
  );
}
