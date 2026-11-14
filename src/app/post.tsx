import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Text } from 'react-native';
import { photoSource } from '../data/images';
import { ago } from '../store/dates';
import { addComment, appreciateComment, blockPerson, byId, fullName, report } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Field, H1, StackScreen } from '../components/ui';

const REASONS = ['Unkind or unfair', 'Spam or irrelevant', 'Privacy', 'Something else'];

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user, run, set, sheet, toast } = useApp();
  const { c, font, semibold } = useTheme();
  const [text, setText] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const post = data.posts.find((p) => p.id === id);
  if (!user || !post) return <StackScreen title="Conversation"><Body>That conversation is not on this phone.</Body></StackScreen>;
  const author = byId(data, post.authorId);
  const img = photoSource(post.image);
  return (
    <StackScreen
      title="Conversation"
      footer={<Button label="Comment" onPress={() => { if (run(addComment(data, post.id, text), 'Comment added.')) setText(''); }} />}
    >
      <Text style={{ color: c.spruce, fontFamily: semibold }}>{post.kind}</Text>
      <H1>{author ? fullName(author) : 'Member'}</H1>
      <Body muted>{ago(post.at)}</Body>
      <Body>{post.body}</Body>
      {img ? <Image source={img} style={{ width: '100%', height: 220, borderRadius: 16 }} contentFit="cover" /> : null}
      {post.comments.map((comment) => {
        const who = byId(data, comment.authorId);
        return (
          <Card key={comment.id}>
            <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(15) }}>{who ? fullName(who) : 'Member'}</Text>
            <Body muted>{ago(comment.at)}</Body>
            <Body>{comment.body}</Body>
            <Text style={{ color: c.spruce, fontFamily: semibold }} onPress={() => set(appreciateComment(data, post.id, comment.id))}>
              Appreciate · {comment.likes.length}
            </Text>
          </Card>
        );
      })}
      <Field label="Your comment" value={text} onChangeText={setText} multiline />
      <Body muted>Report</Body>
      {REASONS.map((item) => (
        <Text key={item} style={{ color: reason === item ? c.spruce : c.ink, fontFamily: semibold, fontSize: font(16) }} onPress={() => setReason(item)}>
          {reason === item ? 'Selected · ' : ''}{item}
        </Text>
      ))}
      <Button
        label="Report"
        kind="secondary"
        onPress={() =>
          sheet({
            title: 'Report this post?',
            message: 'Reason: ' + reason + '. The team reviews reports within one working day.',
            confirmLabel: 'Send report',
            onConfirm: () => {
              run(report(data, post.id, reason), 'Reported. The team reviews reports within one working day.');
            },
          })
        }
      />
      {author && author.id !== user.id ? (
        <Button
          label={'Block ' + author.first}
          kind="danger"
          onPress={() =>
            sheet({
              title: 'Block ' + fullName(author) + '?',
              message: 'You will no longer see their posts or messages on this phone.',
              confirmLabel: 'Block',
              danger: true,
              onConfirm: () => {
                set(blockPerson(data, author.id));
                toast('Blocked.');
                router.back();
              },
            })
          }
        />
      ) : null}
    </StackScreen>
  );
}
