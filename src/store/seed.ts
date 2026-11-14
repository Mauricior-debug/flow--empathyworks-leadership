import { buildWorkshops } from '../data/content';
import { addDays, iso, monday } from './dates';
import type { AppData, Notice, Person, Post } from './types';

const J = 'u-jordan';
const STEVE = 'u-steve';
const NEIL = 'u-neil';
const PRIYA = 'u-priya';
const DANIEL = 'u-daniel';
const HELEN = 'u-helen';
const AMIRA = 'u-amira';

function person(partial: Person): Person {
  return partial;
}

export function seed(now = new Date()): AppData {
  const today = iso(now);
  const week = monday(today);
  const pastWeek = (n: number) => monday(addDays(week, -7 * n));
  const stamp = (daysAgo: number, hh = 9) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hh, 12, 0, 0);
    return d.toISOString();
  };

  const people: Person[] = [
    person({
      id: J,
      first: 'Jordan',
      last: 'Hale',
      email: 'jordan@northbridge.example',
      password: 'leadwell',
      org: 'Northbridge Trust',
      job: 'Head of Service',
      phone: '07700 900123',
      bio: 'I lead a service under pressure. I am here to get better at the conversations I avoid.',
      linkedin: 'https://www.linkedin.com/in/empathyworks',
      showJob: true,
      membership: 'plus',
      interval: 'month',
      role: 'member',
      onboarded: false,
      coaching: true,
      orgPortal: true,
    }),
    person({
      id: STEVE,
      first: 'Steve',
      last: 'Robertson',
      email: 'info@leadershipconsultant.co.uk',
      password: 'leadwell',
      org: 'EmpathyWorks Leadership Consultancy',
      job: 'Founder and Director',
      phone: '',
      bio: 'Founder and Director. Former Prison Governor. Postgraduate study in Humanitarian Leadership at the University of Cambridge.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: 'year',
      role: 'admin',
      onboarded: true,
      coaching: true,
      orgPortal: true,
      teamKey: 'steve',
      photo: 'avSteve',
    }),
    person({
      id: NEIL,
      first: 'Neil',
      last: 'Lavis',
      email: 'neil@leadershipconsultant.co.uk',
      password: '',
      org: 'EmpathyWorks Leadership Consultancy',
      job: 'Senior Consultant',
      phone: '',
      bio: 'Senior Consultant. Former Prison Governor and senior public-service leader.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: null,
      role: 'member',
      onboarded: true,
      coaching: true,
      orgPortal: false,
      teamKey: 'neil',
      photo: 'avNeil',
    }),
    person({
      id: PRIYA,
      first: 'Priya',
      last: 'Shah',
      email: 'priya@example.com',
      password: '',
      org: 'Harbour Health',
      job: 'Service manager',
      phone: '',
      bio: 'I manage a team that is tired and still caring.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: 'month',
      role: 'member',
      onboarded: true,
      coaching: false,
      orgPortal: false,
    }),
    person({
      id: DANIEL,
      first: 'Daniel',
      last: 'Okonkwo',
      email: 'daniel@example.com',
      password: '',
      org: 'Field & Co',
      job: 'Team leader',
      phone: '',
      bio: 'Newly promoted. Learning that the job has changed.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: 'month',
      role: 'member',
      onboarded: true,
      coaching: false,
      orgPortal: false,
    }),
    person({
      id: HELEN,
      first: 'Helen',
      last: 'Brooks',
      email: 'helen@example.com',
      password: '',
      org: 'Civic Partners',
      job: 'Head of operations',
      phone: '',
      bio: 'Trying to close the gap between the values on the wall and the week we actually have.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: 'year',
      role: 'member',
      onboarded: true,
      coaching: false,
      orgPortal: false,
    }),
    person({
      id: AMIRA,
      first: 'Amira',
      last: 'Khan',
      email: 'amira@example.com',
      password: '',
      org: 'Northbridge Trust',
      job: 'People partner',
      phone: '',
      bio: 'I sit with leaders after the survey results land.',
      linkedin: '',
      showJob: true,
      membership: 'plus',
      interval: 'month',
      role: 'member',
      onboarded: true,
      coaching: false,
      orgPortal: false,
    }),
  ];

  const posts: Post[] = [
    {
      id: 'p1',
      authorId: STEVE,
      kind: 'Conversation',
      body: 'Welcome. This is a place to be honest about leadership, not to perform it. What conversation have you been putting off?',
      at: stamp(20, 8),
      likes: [PRIYA, HELEN, J],
      comments: [
        { id: 'c1', authorId: HELEN, body: 'One I have rewritten in my head for three weeks.', at: stamp(19, 11), likes: [STEVE] },
      ],
    },
    {
      id: 'p2',
      authorId: PRIYA,
      kind: 'Question',
      body: 'How do you hold a high standard with someone who is already struggling, without it landing as blame?',
      at: stamp(12, 16),
      likes: [DANIEL, J, AMIRA],
      comments: [
        { id: 'c2', authorId: DANIEL, body: 'I name the standard first, then ask what they are carrying. The order matters.', at: stamp(12, 18), likes: [PRIYA] },
      ],
    },
    {
      id: 'p3',
      authorId: DANIEL,
      kind: 'Achievement',
      body: 'I finally had the conversation I had been avoiding. It was shorter and kinder than I feared, and the standard is clearer now.',
      at: stamp(9, 13),
      likes: [HELEN, PRIYA],
      comments: [],
    },
    {
      id: 'p4',
      authorId: HELEN,
      kind: 'Conversation',
      body: 'Our values say we welcome challenge. In the last leadership meeting, nobody disagreed. I am not sure that is alignment.',
      at: stamp(6, 10),
      likes: [AMIRA, STEVE, J],
      comments: [
        { id: 'c3', authorId: AMIRA, body: 'Silence is not the same as agreement. I have started asking who has not spoken.', at: stamp(6, 15), likes: [HELEN] },
      ],
    },
    {
      id: 'p5',
      authorId: AMIRA,
      kind: 'Question',
      image: 'reflective',
      body: 'What does it look like when a team feels heard, rather than surveyed?',
      at: stamp(3, 9),
      likes: [PRIYA, HELEN],
      comments: [
        { id: 'c4', authorId: PRIYA, body: 'They can tell you what changed because of what they said. Even if the answer was not yet.', at: stamp(3, 12), likes: [AMIRA] },
      ],
    },
    {
      id: 'p6',
      authorId: J,
      kind: 'Conversation',
      body: 'I protected ninety minutes to think this week. It felt uncomfortable, and it was the most useful thing I did.',
      at: stamp(2, 18),
      likes: [DANIEL, STEVE],
      comments: [
        { id: 'c5', authorId: PRIYA, body: 'I am going to put it in the diary as a meeting with myself, or it will not survive.', at: stamp(1, 8), likes: [J] },
      ],
    },
    {
      id: 'p7',
      authorId: DANIEL,
      kind: 'Conversation',
      body: "I thanked someone specifically today. Not 'good job'. I named the decision they made and the person it helped.",
      at: stamp(1, 15),
      likes: [HELEN],
      comments: [],
    },
    {
      id: 'p8',
      authorId: HELEN,
      kind: 'Achievement',
      body: 'I owned a mistake out loud in the team meeting. Two people then told me something I needed to hear.',
      at: stamp(0, 8),
      likes: [AMIRA, PRIYA, DANIEL],
      comments: [],
    },
  ];

  const noticeText: [string, string, string?][] = [
    ['A new home for conversations', 'Posts now open into their own conversation.', '/community'],
    ['Notifications are easier to find', 'Turn them on from the bell or the menu.', '/notifications'],
    ['Leadership Plus on this phone', '£29.99 a month, or £323.89 a year, including VAT. A practice purchase does not charge a card.', '/membership'],
    ['Workshop coming up', 'Compassionate Leadership is open to book.', '/workshops'],
    ['Your monthly call', "You still have this month's 30-minute consultation.", '/book'],
    ['Priya commented', 'Priya replied to your note about thinking time.', '/post'],
    ['A reply from Steve', 'Your question to a consultant has an answer.', '/ask'],
    ['Message from the team', 'The EmpathyWorks team sent you a note.', '/thread'],
    ["This week's challenge", 'Say no to protect your yes.', '/challenge'],
    ['New Leadership Article', 'When Leadership teams lose their way.', '/article'],
    ['Journal', 'A note is flagged for your next coaching session.', '/journal'],
    ['To-do', 'Prepare the opening line before Thursday.', '/todos'],
    ['Community', 'Helen wrote about a leadership meeting where nobody disagreed.', '/community'],
    ['Podcast', 'Rule 3: Normalise Vulnerability is in the library.', '/library'],
    ['Academy', 'Foundations of compassionate leadership is ready when you are.', '/academy'],
    ['Culture survey', 'Combined results need at least five people. Your own answers stay yours.', '/surveys'],
    ['Booking confirmed', 'Leadership Conversation with Steve Robertson is in your calendar.', '/appointments'],
    ['Appearance', 'Larger text, light and dark are in the menu.', '/menu'],
  ];
  const notices: Notice[] = noticeText.map((n, i) => ({
    id: 'n' + (i + 1),
    userId: 'all',
    title: n[0],
    body: n[1],
    at: stamp(17 - i, 8),
    href: n[2],
  }));

  const mirrors = [1, 2, 3, 4].map((n) => {
    const answers: Record<string, number> = {};
    for (let d = 0; d < 6; d++) {
      answers[d + '-0'] = 2 + ((n + d) % 4);
      answers[d + '-1'] = 3 + ((n + d) % 3 === 0 ? 0 : 1);
    }
    return {
      userId: J,
      week: pastWeek(n),
      answers,
      present: 2 + (n % 3),
      word: ['Steady', 'Clearer', 'Braver', 'Quieter'][n - 1],
      done: true,
    };
  });

  return {
    version: 1,
    sessionUserId: null,
    theme: 'auto',
    big: false,
    pushAskHidden: false,
    pushOn: false,
    getStartedHidden: false,
    pendingCodeEmail: null,
    people,
    daily: [
      {
        userId: J,
        date: addDays(today, -1),
        mood: 2,
        showing: ['Present', 'Rushed'],
        line: 'I noticed I filled the silence.',
        note: 'Tomorrow I want one question before a solution.',
      },
    ],
    mirrors,
    journal: [
      {
        id: 'j1',
        userId: J,
        at: stamp(4, 21),
        mood: 1,
        body: 'The team is stretched and I kept adding tasks. I want to name what we will not do.',
        forSession: true,
      },
      {
        id: 'j2',
        userId: J,
        at: stamp(8, 7),
        mood: 3,
        body: 'A one-to-one went better when I summarised what I had heard before I spoke.',
        forSession: false,
      },
    ],
    todos: [
      { id: 'td1', userId: J, title: 'Prepare the opening line', date: addDays(today, 1), time: '09:00', reminder: true, done: false },
      { id: 'td2', userId: J, title: 'Walk the floor for twenty minutes', date: addDays(today, 3), time: '14:00', reminder: true, done: false },
      { id: 'td3', userId: J, title: 'Read this week’s article', date: addDays(today, 2), time: '', reminder: false, done: false },
    ],
    appointments: [
      {
        id: 'ap1',
        userId: J,
        kind: 'discovery',
        withKey: 'steve',
        date: addDays(today, 12),
        slot: '10:00',
        status: 'confirmed',
        zoom: 'https://zoom.us/j/empathyworks',
      },
      {
        id: 'ap2',
        userId: J,
        kind: 'coaching',
        withKey: 'steve',
        date: addDays(today, 18),
        slot: '14:00',
        status: 'confirmed',
        zoom: 'https://zoom.us/j/empathyworks',
      },
    ],
    workshops: buildWorkshops(today),
    bookings: [],
    posts,
    threads: [
      {
        id: 'th-team',
        title: 'EmpathyWorks team',
        memberIds: [J, STEVE],
        team: true,
        messages: [
          {
            id: 'm1',
            senderId: STEVE,
            body: 'Jordan, welcome. Your monthly consultation is there when you want it, and you can message us here any time.',
            at: stamp(5, 9),
          },
          {
            id: 'm2',
            senderId: J,
            body: 'Thank you. I will book the call after I have taken the diagnostic.',
            at: stamp(5, 12),
          },
        ],
      },
      {
        id: 'th-priya',
        title: 'Priya Shah',
        memberIds: [J, PRIYA],
        team: false,
        messages: [
          { id: 'm3', senderId: PRIYA, body: 'Your note about thinking time helped. I blocked Thursday morning.', at: stamp(1, 10) },
        ],
      },
    ],
    asks: [
      {
        id: 'ask1',
        userId: J,
        question: 'How do I raise a standard with someone who is already stretched?',
        askedAt: stamp(8, 11),
        answer:
          'Name the standard in one sentence, then stay for what they are carrying. Compassion is not letting the standard go. It is how you hold it. If you want, bring the opening line to your next call.',
        answeredAt: stamp(6, 9),
        from: 'Steve Robertson',
      },
    ],
    notices,
    reads: { [J]: notices.slice(5).map((n) => n.id), [STEVE]: notices.map((n) => n.id) },
    surveys: [],
    challenges: [],
    academy: [
      {
        userId: J,
        index: 0,
        reflections: ['', '', ''],
        exercise: '',
        application: '',
        done: false,
      },
    ],
    planners: [],
    blueprints: [
      {
        userId: J,
        leader: 'A leader who is clear and kind in the same conversation.',
        behaviours: 'Ask before I tell. Own a mistake in the room. Protect time to think.',
        help: 'I will ask Steve when I am about to avoid a conversation.',
      },
    ],
    objectives: [
      { id: 'ob1', userId: J, title: 'Have the conversation I have been postponing', progress: 40 },
      { id: 'ob2', userId: J, title: 'Leave meetings with one clear expectation', progress: 20 },
    ],
    actions: [
      { id: 'ac1', userId: J, title: 'Write the opening line the night before', done: false, checkIn: '' },
      { id: 'ac2', userId: J, title: 'Ask the team what gets in the way', done: true, checkIn: 'Did this on Monday. Two answers I had not expected.' },
    ],
    notes: [
      {
        id: 'cn1',
        userId: J,
        date: addDays(today, -21),
        body: 'We looked at the conversation you have been postponing. You named the standard and the person. Next time, start with one sentence on what good looks like.',
      },
    ],
    announcements: [
      {
        id: 'an1',
        title: 'December workshop',
        body: 'Compassionate Leadership is open. Plus includes a place. Essentials can book for £35 on this phone, with no card charged.',
        at: stamp(2, 8),
      },
    ],
    feedback: [],
    contacts: [],
    requests: [],
    reports: [],
    blocks: [],
    saved: { [J]: ['B1'] },
    communitySeen: { [J]: stamp(4, 12), [STEVE]: stamp(0, 20) },
    prefs: {
      [J]: { announcements: true, workshops: true, todos: true, messages: true, community: true },
    },
    articlePublished: { B1: true, B2: true, B3: true, B4: true, B5: true },
  };
}

export const DEMO = {
  jordan: { email: 'jordan@northbridge.example', password: 'leadwell' },
  steve: { email: 'info@leadershipconsultant.co.uk', password: 'leadwell' },
};
