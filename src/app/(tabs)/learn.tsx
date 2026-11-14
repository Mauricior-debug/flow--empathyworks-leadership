import { router } from 'expo-router';
import { View } from 'react-native';
import { AppHeader } from '../../components/header';
import { photos } from '../../data/images';
import { ACADEMY, ARTICLES, challengeFor } from '../../data/content';
import { iso, monday } from '../../store/dates';
import { isPlus } from '../../store/logic';
import { useApp } from '../../store/store';
import { Body, Card, Eyebrow, H1, PhotoCard, RowLink, TabScreen } from '../../components/ui';

export default function Learn() {
  const { data, user } = useApp();
  if (!user) return null;
  const article = ARTICLES.find((a) => a.id === 'B1') || ARTICLES[0];
  const challenge = challengeFor(monday(iso()));
  const done = data.academy.filter((a) => a.userId === user.id && a.done).length;
  const plus = isPlus(user);
  return (
    <TabScreen>
      <AppHeader />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <Eyebrow>Learn</Eyebrow>
        <H1>Stay with the work</H1>
        <Body muted>Articles in full, a weekly challenge, twelve Academy modules, two surveys, and a planner for the conversation you are avoiding.</Body>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <PhotoCard
          source={photos.reflective}
          eyebrow="Free to read"
          title={article.n}
          subtitle={article.mins + ' min · ' + article.topic}
          height={240}
          onPress={() => router.push('/article?id=' + article.id)}
        />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Card>
          <Eyebrow>{plus ? 'This Monday' : 'Leadership Plus'}</Eyebrow>
          <H1>{challenge.title}</H1>
          <Body muted>{challenge.body}</Body>
          <RowLink icon="bolt" title={plus ? 'Open the challenge' : 'See what Plus includes'} detail={plus ? 'Accept, complete or skip' : 'The challenge is part of Plus'} onPress={() => router.push('/challenge')} />
        </Card>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Card>
          <RowLink icon="layers" title="Library" detail="Articles, videos, podcasts, exercises, downloads" onPress={() => router.push('/library')} />
          <RowLink icon="cap" title="Academy" detail={done + ' of ' + ACADEMY.length + ' modules'} onPress={() => router.push('/academy')} />
          <RowLink icon="chart" title="Surveys" detail="Diagnostic and culture" onPress={() => router.push('/surveys')} />
          <RowLink icon="chat" title="Difficult conversation planner" detail="Four prompts, saved on this phone" onPress={() => router.push('/planner')} />
        </Card>
      </View>
    </TabScreen>
  );
}
