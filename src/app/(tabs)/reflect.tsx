import { router } from 'expo-router';
import { View } from 'react-native';
import { AppHeader } from '../../components/header';
import { DailyForm } from '../../components/daily-form';
import { photos } from '../../data/images';
import { iso, monday } from '../../store/dates';
import { useApp } from '../../store/store';
import { Body, Card, Eyebrow, H1, PhotoCard, TabScreen } from '../../components/ui';

export default function Reflect() {
  const { data, user } = useApp();
  if (!user) return null;
  const entries = data.journal.filter((j) => j.userId === user.id);
  const mirror = data.mirrors.find((m) => m.userId === user.id && m.week === monday(iso()));
  return (
    <TabScreen>
      <AppHeader />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <Eyebrow>Reflect</Eyebrow>
        <H1>How are you showing up?</H1>
        <Body muted>Start with today. The Mirror can wait until later in the week. The journal is private.</Body>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Card>
          <DailyForm />
        </Card>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <PhotoCard
          source={photos.reflective}
          eyebrow="Once a week"
          title="Leadership Mirror"
          subtitle={mirror?.done ? 'This week is complete. See the change.' : 'Six themes, answered across the week.'}
          onPress={() => router.push('/mirror')}
          height={190}
        />
        <Card>
          <Eyebrow>Journal</Eyebrow>
          <H1>{entries.length ? entries.length + ' private notes' : 'Nothing written yet'}</H1>
          <Body muted>{entries[0]?.body || 'A mood, a few lines, and a tick if you want it in your next coaching session.'}</Body>
          <Body muted>{entries.filter((e) => e.forSession).length ? 'One note is flagged for your next session.' : 'Nothing is flagged for coaching.'}</Body>
        </Card>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <PhotoCard source={photos.hiker} eyebrow="Private" title="Open your journal" subtitle="Search, edit, and keep it to yourself." height={160} onPress={() => router.push('/journal')} />
      </View>
    </TabScreen>
  );
}
