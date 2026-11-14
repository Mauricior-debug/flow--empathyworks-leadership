import { useState } from 'react';
import { Text, View } from 'react-native';
import { DIMS } from '../data/content';
import { fmt, iso, monday } from '../store/dates';
import { saveMirror } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Chip, Eyebrow, Field, H1, H2, StackScreen } from '../components/ui';

function Scale({ value, onChange }: { value?: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View key={n} style={{ flex: 1 }}>
          <Chip label={String(n)} on={value === n} onPress={() => onChange(n)} />
        </View>
      ))}
    </View>
  );
}

export default function Mirror() {
  const { data, user, run } = useApp();
  const { c, font, semibold } = useTheme();
  const week = monday(iso());
  const current = user ? data.mirrors.find((m) => m.userId === user.id && m.week === week) : undefined;
  const [answers, setAnswers] = useState<Record<string, number>>(current?.answers || {});
  const [present, setPresent] = useState<number | null>(current?.present ?? null);
  const [word, setWord] = useState(current?.word || '');
  if (!user) return null;
  const total = DIMS.length * 2;
  const answered = Object.keys(answers).length;
  const ready = answered >= total;
  const past = data.mirrors.filter((m) => m.userId === user.id && m.done && m.week !== week).sort((a, b) => (a.week < b.week ? 1 : -1));
  const score = (map: Record<string, number>, dim: number) => {
    const vals = [map[dim + '-0'], map[dim + '-1']].filter((n) => typeof n === 'number');
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  return (
    <StackScreen
      title="Leadership Mirror"
      footer={
        <Button
          label={ready ? 'Save this week' : 'Save progress'}
          onPress={() => run(saveMirror(data, { answers, present, word, done: ready && present != null && word.trim().length > 0 }), 'Mirror saved.')}
        />
      }
    >
      <Eyebrow>Once a week</Eyebrow>
      <H1>Hold the week up</H1>
      <Body muted>
        Six themes, two statements each. Answer them across the week, from 1 (rarely) to 5 (consistently). {answered} of {total} answered.
      </Body>
      {DIMS.map((dim, di) => (
        <Card key={dim.name}>
          <H2>{dim.name}</H2>
          {dim.statements.map((statement, qi) => {
            const id = di + '-' + qi;
            return (
              <View key={id} style={{ gap: 8 }}>
                <Body>{statement}</Body>
                <Scale value={answers[id]} onChange={(n) => setAnswers({ ...answers, [id]: n })} />
              </View>
            );
          })}
        </Card>
      ))}
      <Card>
        <H2>How present did you feel?</H2>
        <Body muted>With the people you lead, this week.</Body>
        <Scale value={present ?? undefined} onChange={setPresent} />
        <Field label="Your leadership, in one word" value={word} onChangeText={setWord} placeholder="One word" />
      </Card>
      {past.length ? (
        <View style={{ gap: 10 }}>
          <Eyebrow>Change over past weeks</Eyebrow>
          {DIMS.map((dim, di) => {
            const latest = past[0];
            const older = past[1];
            const now = score(answers, di) || score(latest.answers, di);
            const then = older ? score(older.answers, di) : score(latest.answers, di);
            return (
              <View key={dim.name} style={{ gap: 4 }}>
                <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(15) }}>
                  {dim.name} · {now.toFixed(1)}
                </Text>
                <View style={{ height: 8, borderRadius: 8, backgroundColor: c.sunk }}>
                  <View style={{ width: `${(now / 5) * 100}%`, height: 8, borderRadius: 8, backgroundColor: c.spruce }} />
                </View>
                <Text style={{ color: c.muted, fontSize: font(13) }}>
                  Previous {then.toFixed(1)} · {fmt(latest.week)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </StackScreen>
  );
}
