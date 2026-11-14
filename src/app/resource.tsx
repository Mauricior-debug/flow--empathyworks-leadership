import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { ARTICLES, library } from '../data/content';
import { photos } from '../data/images';
import { isPlus, toggleSaved } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, H1, Rich, StackScreen } from '../components/ui';

export default function Resource() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user, set, toast } = useApp();
  const item = library().find((x) => x.id === id);
  const [playing, setPlaying] = useState(false);
  if (!user || !item) return null;
  const locked = item.access === 'plus' && !isPlus(user);
  const saved = (data.saved[user.id] || []).includes(item.id);
  const article = item.articleId ? ARTICLES.find((a) => a.id === item.articleId) : undefined;
  return (
    <StackScreen title={item.type}>
      {item.image ? <Image source={photos[item.image]} style={{ width: '100%', height: 200, borderRadius: 16 }} contentFit="cover" /> : null}
      <H1>{item.title}</H1>
      <Body muted>
        {item.type} · {item.minutes} min · {item.topic}
      </Body>
      {locked ? (
        <Card>
          <Body>This is part of Leadership Plus. The free article stays open on Essentials.</Body>
          <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
        </Card>
      ) : (
        <>
          <Body>{item.summary}</Body>
          {item.type === 'Podcast' && item.link ? (
            <Button label="Open on Spotify" onPress={() => Linking.openURL(item.link!)} />
          ) : null}
          {item.type === 'Video' && article ? (
            <>
              <Body muted>A reading on this phone, using the article’s own words. No stream and no advertising.</Body>
              <Button label={playing ? 'Pause the reading' : 'Play the reading'} onPress={() => setPlaying(!playing)} />
              {playing ? article.blocks.filter((b) => b.t === 'p').slice(0, 6).map((b, i) => <Rich key={i} text={b.x} />) : null}
              <Button label="Read the full article" kind="secondary" onPress={() => router.push('/article?id=' + article.id)} />
            </>
          ) : null}
          {item.body ? <Body>{item.body}</Body> : null}
          {item.type === 'Download' ? (
            <Button
              label={saved ? 'Saved on this phone' : 'Save on this phone'}
              onPress={() => {
                set(toggleSaved(data, item.id));
                toast('Saved on this phone.');
              }}
            />
          ) : (
            <Button label={saved ? 'Saved' : 'Save'} kind="secondary" onPress={() => set(toggleSaved(data, item.id))} />
          )}
        </>
      )}
    </StackScreen>
  );
}
