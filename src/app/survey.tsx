import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { CULTURE, DIMS } from '../data/content';
import { isPlus, saveSurvey } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Chip, H1, H2, StackScreen } from '../components/ui';

export default function Survey() {
  const { which } = useLocalSearchParams<{ which?: string }>();
  const kind = which === 'culture' ? 'culture' : 'leadership';
  const themes = kind === 'culture' ? CULTURE : DIMS;
  const { data, user, run } = useApp();
  const { c, font, semibold } = useTheme();
  const existing = user ? data.surveys.find((s) => s.userId === user.id && s.which === kind) : undefined;
  const [answers, setAnswers] = useState<Record<string, number>>(existing?.answers || {});
  const [show, setShow] = useState(!!existing);
  if (!user) return null;
  const plus = isPlus(user);
  const visible = plus ? themes.length : Math.ceil(themes.length / 2);
  const needed = themes.slice(0, visible).reduce((n, _, i) => n + 2, 0);
  const filled = themes.slice(0, visible).reduce((n, _, i) => n + (answers[i + '-0'] ? 1 : 0) + (answers[i + '-1'] ? 1 : 0), 0);
  const score = (i: number) => {
    const a = answers[i + '-0'];
    const b = answers[i + '-1'];
    if (!a || !b) return 0;
    return (a + b) / 2;
  };
  return (
    <StackScreen
      title={kind === 'culture' ? 'Culture survey' : 'Diagnostic'}
      footer={
        !show ? (
          <Button
            label="See my result"
            disabled={filled < needed}
            onPress={() => {
              if (run(saveSurvey(data, kind, answers), 'Survey saved.')) setShow(true);
            }}
          />
        ) : undefined
      }
    >
      <H1>{kind === 'culture' ? 'Reflection and Culture Survey' : 'Leadership Diagnostic'}</H1>
      <Body muted>
        {plus ? 'The full survey.' : 'The first half is included with Essentials. Plus unlocks the rest and the full result.'} Score each statement from 1 to 5.
      </Body>
      {!show
        ? themes.slice(0, visible).map((theme, i) => (
            <Card key={theme.name}>
              <H2>{theme.name}</H2>
              {theme.statements.map((statement, qi) => (
                <View key={statement} style={{ gap: 8 }}>
                  <Body>{statement}</Body>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <View key={n} style={{ flex: 1 }}>
                        <Chip label={String(n)} on={answers[i + '-' + qi] === n} onPress={() => setAnswers({ ...answers, [i + '-' + qi]: n })} />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </Card>
          ))
        : null}
      {!plus && !show ? (
        <Card>
          <H2>The rest is in Plus</H2>
          {themes.slice(visible).map((theme) => (
            <Body key={theme.name} muted>
              {theme.name}
            </Body>
          ))}
        </Card>
      ) : null}
      {show ? (
        <View style={{ gap: 12 }}>
          <H2>Your result</H2>
          {themes.slice(0, plus ? themes.length : visible).map((theme, i) => (
            <View key={theme.name} style={{ gap: 4 }}>
              <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>
                {theme.name} · {score(i).toFixed(1)}
              </Text>
              <View style={{ height: 8, backgroundColor: c.sunk, borderRadius: 8 }}>
                <View style={{ width: `${(score(i) / 5) * 100}%`, height: 8, backgroundColor: c.spruce, borderRadius: 8 }} />
              </View>
            </View>
          ))}
          {!plus ? <Body muted>The second half of the result is part of Leadership Plus.</Body> : <Body muted>This is the full result, kept on this phone.</Body>}
          <Button label="Edit answers" kind="secondary" onPress={() => setShow(false)} />
        </View>
      ) : null}
    </StackScreen>
  );
}
