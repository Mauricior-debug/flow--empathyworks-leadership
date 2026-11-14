import { ARTICLES, CHALLENGES, challengeFor, library } from '../src/data/content';
import { iso, monday } from '../src/store/dates';
import { askConsultant, bookWorkshop, isPlus, signInCode, signInPassword, unreadCount, upcomingWorkshops } from '../src/store/logic';
import { beginCode } from '../src/store/logic';
import { seed } from '../src/store/seed';

const today = '2026-11-14';
const week = monday(today);
const challenge = challengeFor(week);
if (challenge.title !== 'Say no to protect your yes') {
  throw new Error('Challenge was ' + challenge.title);
}
if (CHALLENGES.length !== 16) throw new Error('Expected 16 challenges');

const data = seed(new Date(today + 'T12:00:00'));
if (data.posts.length !== 8) throw new Error('posts ' + data.posts.length);
if (data.workshops.length !== 13) throw new Error('workshops ' + data.workshops.length);
if (data.notices.length !== 18) throw new Error('notices ' + data.notices.length);
if (upcomingWorkshops(data, today).length !== 13) throw new Error('upcoming');
const jordan = data.people.find((p) => p.first === 'Jordan');
if (!jordan || jordan.membership !== 'plus') throw new Error('plus member missing');
if (unreadCount(data, jordan.id) !== 5) throw new Error('unread ' + unreadCount(data, jordan.id));

const signed = signInPassword(data, 'jordan@northbridge.example', 'leadwell');
if (signed.error || !isPlus(signed.data.people.find((p) => p.id === signed.data.sessionUserId) || null)) {
  throw new Error('sign in failed');
}
const bad = signInPassword(data, 'jordan@northbridge.example', 'short');
if (!bad.error) throw new Error('bad password should fail');

const coded = beginCode(data, 'jordan@northbridge.example');
const withCode = signInCode(coded.data, '246810');
if (withCode.error) throw new Error(withCode.error);
const wrong = signInCode(coded.data, '000000');
if (!wrong.error) throw new Error('wrong code accepted');

const essentials = {
  ...signed.data,
  people: signed.data.people.map((p) => (p.id === signed.data.sessionUserId ? { ...p, membership: 'essentials' as const, interval: null } : p)),
};
const blocked = bookWorkshop(essentials, essentials.workshops[0].id, false);
if (!blocked.error) throw new Error('essentials booked without practice');
const allowed = bookWorkshop(essentials, essentials.workshops[0].id, true);
if (allowed.error) throw new Error(allowed.error);

const asked = askConsultant(signed.data, 'How do I begin?');
if (asked.error) throw new Error(asked.error);
const twice = askConsultant(asked.data, 'Another question');
if (!twice.error) throw new Error('second question in the same week was allowed');

if (ARTICLES.length !== 5) throw new Error('articles');
if (!ARTICLES.every((a) => a.blocks.length > 8)) throw new Error('article text looks short');
const kinds = new Set(library().map((item) => item.type));
for (const kind of ['Article', 'Video', 'Podcast', 'Exercise', 'Download']) {
  if (!kinds.has(kind as 'Article')) throw new Error('missing ' + kind);
}

console.log('ok', {
  challenge: challenge.title,
  posts: data.posts.length,
  workshops: data.workshops.length,
  notices: data.notices.length,
  unread: unreadCount(data, jordan.id),
  today: iso(new Date(today + 'T15:00:00')),
});
