import { router } from 'expo-router';
import { markAllRead, markRead, unreadCount, visibleNotices } from '../store/logic';
import { ago } from '../store/dates';
import { useApp } from '../store/store';
import { Body, Button, Card, Chip, H1, StackScreen } from '../components/ui';

export default function Notifications() {
  const { data, user, set } = useApp();
  if (!user) return null;
  const notices = visibleNotices(data, user.id);
  const read = new Set(data.reads[user.id] || []);
  const prefs = data.prefs[user.id] || { announcements: true, workshops: true, todos: true, messages: true, community: true };
  const unread = unreadCount(data, user.id);
  return (
    <StackScreen title="Notifications">
      <H1>{unread ? unread + ' unread' : 'You are up to date'}</H1>
      <Chip label={data.pushOn ? 'In-app reminders on' : 'In-app reminders off'} on={data.pushOn} onPress={() => set({ ...data, pushOn: !data.pushOn, pushAskHidden: true })} />
      <Button label="Mark all as read" kind="secondary" onPress={() => set(markAllRead(data))} />
      {notices.map((notice) => (
        <Card key={notice.id}>
          <Body muted>{read.has(notice.id) ? ago(notice.at) : 'New · ' + ago(notice.at)}</Body>
          <H1>{notice.title}</H1>
          <Body>{notice.body}</Body>
          <Button
            label="Open"
            kind="quiet"
            onPress={() => {
              set(markRead(data, notice.id));
              if (notice.href === '/post') router.push('/post?id=p6');
              else if (notice.href === '/article') router.push('/article?id=B5');
              else if (notice.href === '/thread') router.push('/thread?id=th-team');
              else if (notice.href === '/menu') router.push('/(tabs)/menu');
              else if (notice.href === '/book') router.push('/book?kind=monthly');
              else if (notice.href) router.push(notice.href);
            }}
          />
        </Card>
      ))}
      <H1>What you hear about</H1>
      {(
        [
          ['announcements', 'Announcements'],
          ['workshops', 'Workshops'],
          ['todos', 'To-dos'],
          ['messages', 'Messages'],
          ['community', 'Community'],
        ] as const
      ).map(([key, label]) => (
        <Chip key={key} label={(prefs[key] ? 'On · ' : 'Off · ') + label} on={prefs[key]} onPress={() => set({ ...data, prefs: { ...data.prefs, [user.id]: { ...prefs, [key]: !prefs[key] } } })} />
      ))}
    </StackScreen>
  );
}
