import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { AppHeader } from '../../components/header';
import { photoSource } from '../../data/images';
import { ago } from '../../store/dates';
import { addPost, byId, communityBadge, fullName, isPlus, seeCommunity, toggleLike } from '../../store/logic';
import { useApp } from '../../store/store';
import { useTheme } from '../../theme/Theme';
import type { PostKind } from '../../store/types';
import { Body, Button, Card, Chip, Eyebrow, Field, H1, TabScreen } from '../../components/ui';

const FILTERS = ['All', 'Achievement', 'Question', 'Conversation'] as const;

export default function Community() {
  const { data, user, run, set } = useApp();
  const { c, font, semibold, body } = useTheme();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [kind, setKind] = useState<PostKind>('Conversation');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (!user || !isPlus(user)) return;
      set((current) => (communityBadge(current, user.id) === 0 ? current : seeCommunity(current)));
    }, [user, set]),
  );
  if (!user) return null;
  const plus = isPlus(user);
  const blocked = new Set(data.blocks.filter((b) => b.blockerId === user.id).map((b) => b.blockedId));
  const posts = data.posts
    .filter((p) => !blocked.has(p.authorId))
    .filter((p) => filter === 'All' || p.kind === filter);

  return (
    <TabScreen>
      <AppHeader />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <Eyebrow>Community</Eyebrow>
        <H1>Leaders, in the open</H1>
        <Body muted>Achievements, questions and conversations. Be honest. Be kind.</Body>
      </View>
      {!plus ? (
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <Card style={{ backgroundColor: c.sunriseSoft, borderColor: c.sunrise }}>
            <Eyebrow>Leadership Plus</Eyebrow>
            <H1>The community is part of Plus</H1>
            <Body>
              You can still message the EmpathyWorks team. Plus is £29.99 a month or £323.89 a year, including VAT. A practice purchase on this phone unlocks it and does not charge a card.
            </Body>
            <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
            <Button label="Message the team" kind="secondary" onPress={() => router.push('/thread?id=th-team')} />
          </Card>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <Card>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(['Conversation', 'Question', 'Achievement'] as PostKind[]).map((k) => (
                <Chip key={k} label={k} on={kind === k} onPress={() => setKind(k)} />
              ))}
            </View>
            <Field label="Share something" value={text} onChangeText={setText} multiline placeholder="What are you noticing?" />
            <Chip label={photo ? 'Photo added' : 'Add a photo'} on={photo} onPress={() => setPhoto(!photo)} />
            <Button
              label="Post"
              onPress={() => {
                const result = addPost(data, kind, text, photo ? 'hiker' : undefined);
                if (run(result, 'Posted.')) setText('');
              }}
            />
          </Card>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <Chip key={f} label={f === 'All' ? 'All' : f + 's'} on={filter === f} onPress={() => setFilter(f)} />
            ))}
          </View>
          {posts.map((post) => {
            const author = byId(data, post.authorId);
            const img = photoSource(post.image);
            return (
              <Card key={post.id}>
                <Text style={{ color: c.spruce, fontFamily: semibold, fontSize: font(13) }}>{post.kind}</Text>
                <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }} onPress={() => router.push('/profile?id=' + post.authorId)}>
                  {author ? fullName(author) : 'Member'}
                  {author?.teamKey ? ' · EmpathyWorks' : ''}
                </Text>
                <Text style={{ color: c.muted, fontFamily: body, fontSize: font(13) }}>{ago(post.at)}</Text>
                <Body>{post.body}</Body>
                {img ? <Image source={img} style={{ width: '100%', height: 180, borderRadius: 12 }} contentFit="cover" /> : null}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Text style={{ color: c.spruce, fontFamily: semibold }} onPress={() => set(toggleLike(data, post.id))}>
                    {post.likes.includes(user.id) ? 'Liked' : 'Like'} · {post.likes.length}
                  </Text>
                  <Text style={{ color: c.spruce, fontFamily: semibold }} onPress={() => router.push('/post?id=' + post.id)}>
                    Comments · {post.comments.length}
                  </Text>
                </View>
              </Card>
            );
          })}
          {!posts.length ? <Body muted>Nothing in this filter yet.</Body> : null}
        </View>
      )}
    </TabScreen>
  );
}
