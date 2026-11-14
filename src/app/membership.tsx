import { ESSENTIALS_INC, PLUS_INC, PLUS_MONTH, PLUS_YEAR, money } from '../data/content';
import { isPlus, setMembership } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, H1, StackScreen } from '../components/ui';

export default function Membership() {
  const { data, user, run, sheet } = useApp();
  if (!user) return null;
  const plus = isPlus(user) && user.role !== 'admin' ? user.membership === 'plus' : user.membership === 'plus';
  const showPlus = user.membership === 'plus' || user.role === 'admin';
  return (
    <StackScreen title="Membership">
      <H1>{showPlus ? 'Leadership Plus' : 'Leadership Essentials'}</H1>
      <Body muted>Prices include VAT for Plus. Organisation partnerships are priced separately and are plus VAT. A practice purchase on this phone does not charge a card.</Body>
      <Card>
        <H1>Leadership Essentials</H1>
        <Body>Free</Body>
        {ESSENTIALS_INC.map((item) => (
          <Body key={item}>{item}</Body>
        ))}
        {showPlus ? (
          <Button
            label="Switch to Essentials"
            kind="secondary"
            onPress={() =>
              sheet({
                title: 'Practice cancel',
                message: 'Leadership Plus ends on this phone. No card is involved. You can unlock it again.',
                confirmLabel: 'Switch to Essentials',
                onConfirm: () => run(setMembership(data, 'essentials', null), 'You are on Leadership Essentials.'),
              })
            }
          />
        ) : null}
      </Card>
      <Card>
        <H1>Leadership Plus</H1>
        <Body>{money(PLUS_MONTH)} a month, or {money(PLUS_YEAR)} a year, including VAT.</Body>
        {PLUS_INC.map((item) => (
          <Body key={item}>{item}</Body>
        ))}
        {!showPlus ? (
          <>
            <Button
              label={'Practice subscribe · ' + money(PLUS_MONTH) + ' / month'}
              onPress={() =>
                sheet({
                  title: 'Practice purchase',
                  message: 'Leadership Plus is ' + money(PLUS_MONTH) + ' a month, including VAT. This unlocks Plus on this phone. No card is charged.',
                  confirmLabel: 'Unlock Plus',
                  onConfirm: () => run(setMembership(data, 'plus', 'month'), 'Leadership Plus is unlocked on this phone.'),
                })
              }
            />
            <Button
              label={'Practice subscribe · ' + money(PLUS_YEAR) + ' / year'}
              kind="secondary"
              onPress={() =>
                sheet({
                  title: 'Practice purchase',
                  message: 'Leadership Plus is ' + money(PLUS_YEAR) + ' a year, including VAT. This unlocks Plus on this phone. No card is charged.',
                  confirmLabel: 'Unlock Plus',
                  onConfirm: () => run(setMembership(data, 'plus', 'year'), 'Leadership Plus is unlocked on this phone.'),
                })
              }
            />
          </>
        ) : (
          <Body muted>Interval on this phone: {user.interval === 'year' ? 'yearly' : 'monthly'}.</Body>
        )}
      </Card>
      {plus ? null : null}
    </StackScreen>
  );
}
