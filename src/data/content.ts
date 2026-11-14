import articlesJson from './articles.json';
import podcastsJson from './podcasts.json';
import { addDays, iso, weekNo } from '../store/dates';
import type { PhotoKey, Workshop } from '../store/types';

export const TAGLINE = 'Helping people lead well in hard places.';
export const EMAIL = 'info@leadershipconsultant.co.uk';
export const DEMO_CODE = '246810';
export const ZOOM = 'https://zoom.us/j/empathyworks';
export const PLUS_MONTH = 29.99;
export const PLUS_YEAR = 323.89;
export const WORKSHOP_PRICE = 35;

export const MOODS = [
  { name: 'Drained', color: '#E5321E' },
  { name: 'Stretched', color: '#F59A1A' },
  { name: 'Steady', color: '#1590E0' },
  { name: 'Positive', color: '#12A88A' },
  { name: 'Energised', color: '#6A2FC0' },
] as const;

export const SHOWING = ['Present', 'Calm', 'Supportive', 'Clear', 'Rushed', 'Distracted', 'Reactive', 'Avoiding'];

export const TOPICS = [
  'Compassionate leadership',
  'Emotional intelligence',
  'Accountability',
  'Organisational culture',
  'Difficult conversations',
  'Leadership development',
  'Leadership teams',
];

export const DIMS: { name: string; statements: [string, string] }[] = [
  {
    name: 'Self-awareness',
    statements: [
      'I understand how my mood affects the people around me.',
      'I ask for feedback on my leadership, even when it may be uncomfortable.',
    ],
  },
  {
    name: 'Clarity and decisions',
    statements: [
      'I make difficult decisions in good time, even with incomplete information.',
      'The people I lead know what I expect of them.',
    ],
  },
  {
    name: 'Difficult conversations',
    statements: [
      'I address performance or behaviour issues early rather than hoping they resolve.',
      'I stay calm and curious when a conversation becomes heated.',
    ],
  },
  {
    name: 'Accountability',
    statements: [
      'I hold people to high standards without losing warmth.',
      'I own my mistakes openly with my team.',
    ],
  },
  {
    name: 'Compassion',
    statements: [
      'I notice when someone in my team is struggling.',
      'People feel safe to raise concerns with me.',
    ],
  },
  {
    name: 'Resilience',
    statements: [
      'I protect time to think, not just react.',
      'I have somewhere confidential to work through pressure.',
    ],
  },
];

export const CULTURE: { name: string; statements: [string, string] }[] = [
  {
    name: 'Trust in leadership',
    statements: [
      'I trust the senior team to make good decisions.',
      'Leaders do what they say they will do.',
    ],
  },
  {
    name: 'Feeling heard',
    statements: ['I feel heard when I raise something.', 'My ideas are taken seriously.'],
  },
  {
    name: 'Clarity',
    statements: [
      'I understand where the organisation is heading.',
      'I know what is expected of me.',
    ],
  },
  {
    name: 'Psychological safety',
    statements: [
      'I can admit a mistake without fear.',
      'People here can disagree openly.',
    ],
  },
  {
    name: 'Wellbeing and workload',
    statements: [
      'My workload is manageable most weeks.',
      'My manager notices when I am struggling.',
    ],
  },
];

export type Block = { t: 'p' | 'h' | 'q' | 'big'; x: string };
export type Article = {
  id: string;
  n: string;
  blocks: Block[];
  refs: string[];
  mins: number;
  ex: string;
  topic: string;
  img: PhotoKey;
  pos: string;
};

export const ARTICLES = articlesJson as Article[];
export const FREE_ARTICLE = 'B1';

export const CHALLENGES: { title: string; body: string }[] = [
  {
    title: "Have the conversation you've been putting off",
    body: 'Pick one conversation you have been avoiding. Plan it, have it this week, and notice what happens.',
  },
  {
    title: 'Protect 90 minutes of thinking time',
    body: "Block it in your diary and treat it like your most important meeting. Think, don't do.",
  },
  {
    title: 'Thank someone specifically',
    body: 'Not "thanks for your hard work" but exactly what they did and the difference it made.',
  },
  {
    title: 'Watch people leave your meetings',
    body: 'Notice how people look as they walk out. Energised, flat, relieved? What does that tell you?',
  },
  {
    title: 'Ask for one piece of honest feedback',
    body: 'Ask one person: "What is one thing I could do better as your leader?" Then just listen.',
  },
  {
    title: 'Catch yourself avoiding',
    body: 'Each time you notice you are putting something off, name it to yourself and write it down.',
  },
  {
    title: 'Ask before you tell',
    body: 'In every one-to-one this week, ask two open questions before you offer a view or a solution.',
  },
  {
    title: 'Walk the floor',
    body: 'Spend 20 minutes where the work actually happens, with no agenda except to listen.',
  },
  {
    title: 'Own a mistake out loud',
    body: 'Tell your team about something you got wrong recently and what you learned from it.',
  },
  {
    title: 'Make one expectation crystal clear',
    body: 'Pick the expectation people are most unsure about. Say it plainly, explain why it matters and check it has landed.',
  },
  {
    title: 'Notice who is struggling',
    body: 'Look for one person who seems quieter or more stretched than usual. Check in privately and properly.',
  },
  {
    title: 'Hold someone to account, kindly',
    body: 'Address one standard that has slipped. Be clear about the gap and warm about the person.',
  },
  {
    title: 'Say no to protect your yes',
    body: 'Turn down or hand back one thing this week so you can do the most important thing well.',
  },
  {
    title: 'Close the loop',
    body: 'Go back to someone who raised a concern and tell them what happened as a result, even if the answer is "not yet".',
  },
  {
    title: 'Leave on time once',
    body: 'Model the balance you want your team to have. Finish on time one day and say why.',
  },
  {
    title: 'Find out what people really think',
    body: 'Ask your team: "What is one thing we do here that gets in the way?" Thank them, whatever they say.',
  },
];

export function challengeFor(week: string) {
  const i = ((weekNo(week) % CHALLENGES.length) + CHALLENGES.length) % CHALLENGES.length;
  return { ...CHALLENGES[i], index: i };
}

export const SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
];

export const BOOK_TYPES = [
  {
    id: 'monthly',
    name: 'Your monthly 30-minute consultation',
    detail: '30 minutes with the EmpathyWorks team, included with Leadership Plus. One each calendar month.',
    plus: true,
  },
  {
    id: 'discovery',
    name: 'Leadership Conversation',
    detail: 'A conversation about you, your team or your organisation.',
    plus: false,
  },
  {
    id: 'dev',
    name: 'Development conversation',
    detail: 'Talk through your development, programmes or the Academy.',
    plus: false,
  },
  {
    id: 'coaching',
    name: 'Coaching check-in',
    detail: 'A 30-minute check-in between your coaching sessions.',
    plus: false,
  },
  {
    id: 'consult',
    name: 'Organisational consultation',
    detail: 'Time with your partnership lead.',
    plus: false,
  },
] as const;

export const TEAM = [
  { key: 'steve' as const, name: 'Steve Robertson', role: 'Founder and Director' },
  { key: 'neil' as const, name: 'Neil Lavis', role: 'Senior Consultant' },
];

export const ESSENTIALS_INC = [
  'Daily reflection and the Leadership Mirror',
  'Your private leadership journal',
  'One free Leadership Article',
  'The first half of the Leadership Diagnostic',
  'The first half of the Reflection and Culture Survey',
  'Monthly workshops at £35',
];

export const PLUS_INC = [
  'Everything in Leadership Essentials',
  'A 30-minute consultation every month',
  'The monthly workshop included',
  'One question a week to a consultant',
  'The full surveys, with your results',
  'Every Leadership Article',
  'A new leadership challenge every week',
  'The member community and messages',
  "Members' resources",
];

export const PROGRAMME = [
  { title: 'Compassionate Leadership', topic: 'Compassionate leadership', d: 'Understanding compassionate leadership, balancing empathy with accountability, and leading people with humanity and purpose.' },
  { title: 'Psychological Safety', topic: 'Organisational culture', d: 'Creating environments where people feel safe to speak up, challenge decisions, share ideas and acknowledge mistakes.' },
  { title: 'The Human Workspace', topic: 'Emotional intelligence', d: 'Understanding the human experience of work, including trauma, emotional wellbeing, relationships and the impact of leadership behaviour.' },
  { title: 'Courageous Conversations', topic: 'Difficult conversations', d: 'Developing the confidence and skills to manage difficult conversations, address poor performance and provide constructive feedback.' },
  { title: 'Leadership, Culture & Accountability', topic: 'Accountability', d: 'Exploring how leaders shape organisational culture, establish expectations and create accountability without fear.' },
  { title: 'Leading Through Change', topic: 'Leadership development', d: 'Supporting people through uncertainty, organisational change and challenging circumstances while maintaining trust and engagement.' },
  { title: 'Emotional Intelligence in Leadership', topic: 'Emotional intelligence', d: 'Developing self-awareness, empathy, emotional regulation and the ability to understand the needs of others.' },
  { title: 'Boundaries, Resilience & Burnout', topic: 'Leadership development', d: 'Recognising the pressures of leadership, establishing healthy boundaries and supporting sustainable performance.' },
  { title: 'Inspirational Leadership', topic: 'Leadership development', d: 'Exploring how leaders inspire others, communicate purpose, build confidence and create a shared sense of direction.' },
  { title: 'Coaching Conversations for Leaders', topic: 'Leadership development', d: 'Developing practical coaching skills, asking better questions, listening effectively and helping people find their own solutions.' },
  { title: 'Building High-Performing Teams', topic: 'Leadership teams', d: 'Understanding trust, collaboration, motivation, team dynamics and the leadership behaviours that support collective success.' },
  { title: 'Reflective Leadership', topic: 'Leadership development', d: 'Reviewing personal leadership development, recognising achievements, identifying learning and setting intentions for the year ahead.' },
];

export function buildWorkshops(today = iso()): Workshop[] {
  const start = parseStart(today);
  const out: Workshop[] = [];
  const push = (monthOffset: number, day: number, titleIndex: number, extra: boolean) => {
    const base = new Date(start.getFullYear(), start.getMonth() + monthOffset, day, 12);
    const date = iso(base);
    const item = PROGRAMME[titleIndex % PROGRAMME.length];
    const inPerson = extra;
    out.push({
      id: 'ws-' + date + (extra ? '-b' : ''),
      title: item.title,
      topic: item.topic,
      summary: item.d,
      format: inPerson ? 'In person, Taunton' : 'Online (Zoom)',
      facilitator: inPerson ? 'neil' : monthOffset % 2 === 0 ? 'steve' : 'neil',
      date,
      time: inPerson ? '09:30–16:00' : '10:00–11:00',
      places: inPerson ? 14 : 25,
      price: WORKSHOP_PRICE,
    });
  };
  push(0, 8, 0, false);
  push(0, 22, 0, true);
  for (let i = 1; i <= 11; i++) push(i, 15, i, false);
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

function parseStart(today: string) {
  const d = new Date(today + 'T12:00:00');
  const month = d.getDate() > 12 ? d.getMonth() + 1 : d.getMonth();
  return new Date(d.getFullYear(), month, 1, 12);
}

export type Module = {
  title: string;
  summary: string;
  objectives: string[];
  intro: string;
  exercise: string;
  questions: string[];
  application: string;
};

export const ACADEMY: Module[] = [
  {
    title: 'Foundations of compassionate leadership',
    summary: 'What compassionate leadership really is, and why it is a strength rather than a softness.',
    objectives: [
      'Describe compassionate leadership in your own words',
      'Explain why compassion and accountability belong together',
      'Recognise where your own leadership is already compassionate, and where it is not yet',
    ],
    intro:
      'Compassion in leadership is not about being nice or avoiding hard decisions. It is noticing what people are carrying, understanding it, and then acting to help, while still holding clear standards. In the hardest places to lead, people remember how you made them feel long after they forget what you decided.',
    exercise:
      'Think of the best and worst leaders you have worked for. Write down three things each one did that affected how you felt at work. Circle anything that involved noticing, understanding or acting on what you were going through.',
    questions: [
      'When have you mistaken compassion for avoiding a difficult decision?',
      'Who in your team might be carrying more than you realise right now?',
      'What would the people you lead say compassion from you looks like?',
    ],
    application:
      'This week, have one short conversation where your only aim is to understand how someone is really doing. Ask, listen, and resist fixing anything until they have finished.',
  },
  {
    title: 'The coaching mindset',
    summary: 'Moving from telling and fixing to helping people think for themselves.',
    objectives: [
      'Explain the difference between directing, advising and coaching',
      'Notice your own urge to rescue or fix',
      'Use a simple coaching structure in everyday conversations',
    ],
    intro:
      'Most leaders are promoted because they are good at solving problems. The coaching mindset asks you to hold back that instinct, so the other person builds the confidence and capability to solve problems themselves. It is slower at first and much faster over time.',
    exercise:
      'For one day, keep a tally every time someone brings you a problem. Note whether you told them the answer, gave advice, or asked a question that helped them find their own answer.',
    questions: [
      'What do you gain personally from being the person with the answers?',
      'Which person in your team would grow most if you coached rather than told?',
      'What makes it hard for you to stay curious when you are under pressure?',
    ],
    application:
      'Next time someone brings you a problem, ask "What have you already thought about?" and "What would you do if I wasn\'t here?" before offering any view.',
  },
  {
    title: 'Listening that changes conversations',
    summary: 'The difference between hearing someone and helping them feel heard.',
    objectives: [
      'Recognise the levels of listening',
      'Use reflecting and summarising to show you have understood',
      'Notice what gets in the way of your own listening',
    ],
    intro:
      'People rarely say everything that matters in their first sentence. Deep listening means giving full attention to what is said, how it is said, and what is not said. When people feel genuinely heard, defences drop and honest conversation becomes possible.',
    exercise:
      'In your next one-to-one, try to say nothing except short reflections and summaries for the first five minutes. Afterwards, write down what you learned that you would otherwise have missed.',
    questions: [
      'What do you usually do while the other person is still talking?',
      'Whose voice in your team is heard least, and why?',
      'How do you know when someone has felt truly listened to?',
    ],
    application: 'End three conversations this week by summarising what you heard and asking, "Have I understood that properly?"',
  },
  {
    title: 'The art of powerful questions',
    summary: 'Asking questions that open thinking rather than close it down.',
    objectives: [
      'Tell open, closed and leading questions apart',
      'Build a personal set of powerful questions',
      'Use silence to give people room to think',
    ],
    intro:
      'A good question can do more than any piece of advice. Powerful questions are short, open and genuinely curious. They invite people to think, take ownership and discover something new, rather than guess the answer you already have in mind.',
    exercise: 'Write down ten questions you often ask at work. Rewrite each one so it is open, short and free of your own opinion.',
    questions: [
      'Which of your questions are really suggestions in disguise?',
      'How comfortable are you with silence after asking a question?',
      'What question would you most like someone to ask you right now?',
    ],
    application: 'Choose two questions from your rewritten list and use them in real conversations this week. Notice what changes.',
  },
  {
    title: 'Emotional intelligence in practice',
    summary: 'Understanding your own emotions, and how they shape the people around you.',
    objectives: [
      'Recognise your own emotional triggers at work',
      'Understand how your mood affects your team',
      'Use simple techniques to respond rather than react',
    ],
    intro:
      'Leaders set the emotional weather for their teams. Emotional intelligence starts with noticing what you are feeling and why, so you can choose how to respond. It also means reading what others are feeling, even when they do not say it.',
    exercise:
      'For a week, note two moments each day when you felt a strong emotion at work. Record what triggered it, what you did, and what you wish you had done.',
    questions: [
      'What situations most reliably knock you off balance?',
      'How would your team describe your mood on a difficult day?',
      'What helps you pause before you respond?',
    ],
    application: 'Before your next difficult meeting, take one minute to name how you are feeling and decide how you want to show up.',
  },
  {
    title: 'Accountability without blame',
    summary: 'Holding high standards while protecting dignity and trust.',
    objectives: [
      'Separate the behaviour from the person',
      'Set clear expectations people can actually meet',
      'Respond to mistakes in a way that builds learning, not fear',
    ],
    intro:
      'Accountability is not punishment. It is being clear about what is expected, noticing when it is not happening, and addressing it early and fairly. When people feel safe to admit mistakes, problems surface sooner and standards rise.',
    exercise:
      'Pick one expectation in your team that is often not met. Write down how you have communicated it, how clear it really is, and what support people have had to meet it.',
    questions: [
      'When did you last let a standard slip because a conversation felt too hard?',
      'How do people in your team react when they make a mistake?',
      'Where are you clear about the "what" but not the "why"?',
    ],
    application: 'Restate one important expectation this week: what good looks like, why it matters, and what help is available.',
  },
  {
    title: 'Difficult and courageous conversations',
    summary: 'Having the conversations that matter, rather than avoiding them.',
    objectives: [
      'Understand the real cost of avoidance',
      'Prepare for a difficult conversation using a simple structure',
      'Stay calm and curious when emotions run high',
    ],
    intro:
      'The conversations leaders avoid are often the ones that matter most. Avoidance rarely makes problems go away; it lets them grow. Courageous conversations are honest, respectful and well prepared, and they are a skill that gets easier with practice.',
    exercise:
      'Use the Difficult conversation planner in the app to prepare for one conversation you have been putting off: the issue, what good looks like, what they might say, and your opening line.',
    questions: [
      'Which conversation have you been avoiding, and what is it costing?',
      'What story are you telling yourself about how it will go?',
      'How would you like the other person to feel when it is over?',
    ],
    application: 'Have the conversation you planned within the next two weeks. Afterwards, note what went well and what you would do differently.',
  },
  {
    title: 'Trauma-informed leadership',
    summary: 'Leading with awareness of how stress and past experience shape behaviour.',
    objectives: [
      'Understand how stress and trauma can affect people at work',
      'Recognise signs that someone may be struggling',
      'Create conditions of safety, choice and trust',
    ],
    intro:
      'Many people carry experiences that shape how they respond to pressure, conflict or authority. Trauma-informed leadership does not mean becoming a therapist. It means asking "what has happened to this person?" rather than "what is wrong with them?", and leading in a way that builds safety.',
    exercise:
      'Think about a time someone in your team reacted in a way that surprised you. Write down what else might have been going on for them, beyond what you could see.',
    questions: [
      'How might your own leadership feel threatening to someone, without you intending it?',
      'Where could you offer people more choice or predictability?',
      'What support exists for people who are struggling, and do they know about it?',
    ],
    application: 'Identify one practice in your team, such as how changes are announced, that could feel unsafe. Make one small change to it.',
  },
  {
    title: 'Resilience and self-care for leaders',
    summary: 'Sustaining yourself so you can keep supporting others.',
    objectives: [
      'Recognise your early signs of stress and burnout',
      'Build habits that protect your energy and judgement',
      'Find confidential places to work through pressure',
    ],
    intro:
      'Leaders often look after everyone except themselves. Resilience is not about coping with endless pressure; it is about recovery, perspective and support. A depleted leader makes poorer decisions and models the wrong habits for their team.',
    exercise: "Draw two columns: what drains you at work and what restores you. Look at last week's diary and estimate how much time went on each.",
    questions: [
      'What are the first signs that you are running on empty?',
      'Who do you talk to when leadership feels heavy?',
      'What would you advise a colleague in your position to do?',
    ],
    application: 'Protect one block of time this week for thinking or recovery, and treat it as seriously as any meeting.',
  },
  {
    title: 'Leading and coaching teams',
    summary: 'Helping a group work well together, not just individuals.',
    objectives: [
      'Understand what makes a team more than a group of individuals',
      'Facilitate conversations where everyone contributes',
      'Address unhelpful patterns in team dynamics',
    ],
    intro:
      'Teams develop habits: who speaks, who stays quiet, how conflict is handled, what is never said. Leading a team well means paying attention to those patterns and helping the group have the conversations it needs to grow.',
    exercise: 'In your next team meeting, keep a simple note of who speaks, for how long, and who is not heard. Reflect on what it tells you.',
    questions: [
      'What topic does your team avoid discussing together?',
      'How do decisions really get made in your team?',
      'What would make it safer for quieter voices to speak up?',
    ],
    application: 'Open your next team meeting with one question everyone answers in turn, so every voice is heard early.',
  },
  {
    title: 'Culture and organisational change',
    summary: 'Understanding the culture people actually experience, and how leaders shape it.',
    objectives: [
      'Distinguish the culture an organisation describes from the one people experience',
      "Recognise how leaders' behaviour shapes culture",
      'Lead change in a way that brings people with you',
    ],
    intro:
      'Culture is not what is written on the wall; it is what people experience every day. It is shaped most by what leaders do, tolerate and reward. Lasting change comes when people understand why it matters and feel part of it.',
    exercise: 'Take the Reflection and Culture Survey in the app, then compare your results with how you think your own team would answer.',
    questions: [
      'What behaviour does your organisation say it values but quietly tolerates the opposite?',
      'What do new starters notice in their first month?',
      'Where is your own behaviour shaping the culture, for better or worse?',
    ],
    application: 'Choose one behaviour you want to see more of in your team. Model it visibly this week and recognise it when others do it.',
  },
  {
    title: 'Bringing it all together',
    summary: 'Integrating what you have learned into your own leadership approach.',
    objectives: [
      'Reflect on how your leadership has changed through the Academy',
      'Write your personal leadership commitments',
      'Plan how you will keep developing',
    ],
    intro:
      'Leadership development does not end with a programme. This final module helps you look back at what has changed, decide what you want to keep doing, and set out how you will continue to grow as a compassionate and accountable leader.',
    exercise:
      'Re-read your Leadership Mirror entries and Academy reflections from the start of the programme. Write a short letter to yourself describing how you have changed.',
    questions: [
      'What are you doing differently now that you were not doing at the start?',
      'Which module challenged you most, and why?',
      'What kind of leader do you want to be in a year\'s time?',
    ],
    application: 'Write three personal leadership commitments and share them with someone who will hold you to them.',
  },
];

export type LibKind = 'Article' | 'Video' | 'Podcast' | 'Exercise' | 'Download';

export type LibItem = {
  id: string;
  type: LibKind;
  topic: string;
  title: string;
  summary: string;
  minutes: number;
  access: 'free' | 'plus';
  image?: PhotoKey;
  link?: string;
  articleId?: string;
  body?: string;
};

type Pod = {
  id: string;
  n: string;
  topic: string;
  d: string;
  mins: number;
  link: string;
  series?: string;
  acc?: string;
};

const PODS = podcastsJson as Pod[];

export function library(): LibItem[] {
  const articles: LibItem[] = ARTICLES.map((a) => ({
    id: a.id,
    type: 'Article',
    topic: a.topic,
    title: a.n,
    summary: a.ex,
    minutes: a.mins,
    access: a.id === FREE_ARTICLE ? 'free' : 'plus',
    image: a.img,
    articleId: a.id,
  }));
  const podcasts: LibItem[] = PODS.map((p) => ({
    id: p.id,
    type: 'Podcast',
    topic: p.topic,
    title: p.n,
    summary: p.d,
    minutes: p.mins,
    access: 'free',
    link: p.link,
    image: 'steveSuit',
  }));
  const videos: LibItem[] = [
    {
      id: 'V1',
      type: 'Video',
      topic: 'Compassionate leadership',
      title: 'A reading: compassion and accountability',
      summary: 'Steve’s words from the free article, read on this phone. No stream and no advertising.',
      minutes: 6,
      access: 'plus',
      image: 'steveStage',
      articleId: 'B1',
    },
    {
      id: 'V2',
      type: 'Video',
      topic: 'Organisational culture',
      title: 'A reading: the culture people experience',
      summary: 'The opening of the culture article, paced as a short reading.',
      minutes: 5,
      access: 'plus',
      image: 'steveNeil',
      articleId: 'B2',
    },
  ];
  const exercises: LibItem[] = [
    {
      id: 'L4',
      type: 'Exercise',
      topic: 'Difficult conversations',
      title: 'Difficult conversation planner',
      summary: 'Prepare the issue, what good looks like, what they might say, and your opening line.',
      minutes: 10,
      access: 'free',
      image: 'reflective',
    },
    {
      id: 'EX2',
      type: 'Exercise',
      topic: 'Emotional intelligence',
      title: 'Notice the weather you set',
      summary: ACADEMY[4].exercise,
      minutes: 15,
      access: 'plus',
      body: ACADEMY[4].intro + '\n\n' + ACADEMY[4].exercise,
      image: 'hiker',
    },
    {
      id: 'EX3',
      type: 'Exercise',
      topic: 'Accountability',
      title: 'One expectation, said plainly',
      summary: ACADEMY[5].exercise,
      minutes: 12,
      access: 'plus',
      body: ACADEMY[5].intro + '\n\n' + ACADEMY[5].exercise + '\n\n' + ACADEMY[5].application,
      image: 'neilCoaching',
    },
  ];
  const downloads: LibItem[] = [
    {
      id: 'DL1',
      type: 'Download',
      topic: 'Leadership development',
      title: 'Weekly Mirror prompts',
      summary: 'The six themes and twelve statements, to keep on this phone.',
      minutes: 4,
      access: 'free',
      body: DIMS.map((d) => d.name + '\n' + d.statements.map((s) => '• ' + s).join('\n')).join('\n\n'),
    },
    {
      id: 'DL2',
      type: 'Download',
      topic: 'Difficult conversations',
      title: 'Conversation planner sheet',
      summary: 'Four prompts for the conversation you have been putting off.',
      minutes: 5,
      access: 'plus',
      body: 'The issue, in one sentence.\n\nWhat good looks like.\n\nWhat they might say.\n\nYour opening line.\n\n' + ACADEMY[6].exercise,
    },
  ];
  return [...articles, ...videos, ...podcasts, ...exercises, ...downloads];
}

export const CHANGELOG: { id: string; date: string; title: string; items: string[] }[] = [
  {
    id: '2026-11-13a',
    date: '2026-11-13',
    title: 'A new home for conversations',
    items: [
      'Every post now has its own conversation page.',
      'Reply to a comment and follow the thread.',
      'Appreciate a comment when it helps.',
      'See when each reply was posted.',
    ],
  },
  {
    id: '2026-11-12a',
    date: '2026-11-12',
    title: 'Notifications are easier to find',
    items: ['Turn on reminders from the bell, the menu, or notification settings.', 'The on and off switch sits at the top of settings.'],
  },
  {
    id: '2026-11-10a',
    date: '2026-11-10',
    title: 'Join Leadership Plus in the app',
    items: [
      'Leadership Plus is £29.99 a month, or £323.89 a year.',
      'On this phone, a practice purchase unlocks Plus and does not charge a card.',
      'Booking a call is optional.',
    ],
  },
  {
    id: '2026-11-08a',
    date: '2026-11-08',
    title: 'Your to-do list',
    items: ['Add a date, a time and a reminder.', 'Reminders gather under the bell.'],
  },
  {
    id: '2026-11-03a',
    date: '2026-11-03',
    title: 'The workshop programme',
    items: [
      'Monthly workshops through the year.',
      'Leadership Plus includes the workshop. Leadership Essentials can book a place for £35.',
    ],
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I cancel Leadership Plus?',
    a: 'Open Menu, then Membership, and choose Practice cancel. Plus stays until you switch back. Nothing is charged on this phone.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Open Menu, then Account, then Delete account. Type DELETE to confirm. Everything for that account is removed from this phone.',
  },
  {
    q: 'Who can see my reflections and journal?',
    a: 'Only you. A coach sees a journal note only when you tick it for your next session. Your employer never sees your reflections, journal or Leadership Mirror.',
  },
  {
    q: 'How do I book or change a session?',
    a: 'Open Menu, then Appointments. You can book a free 30-minute slot in the next 60 days, open the Zoom link, or cancel.',
  },
  {
    q: 'How do I report a post or block someone?',
    a: 'On a post or a message, choose Report and a reason. To block someone, open the conversation and choose Block. You will no longer see their posts or messages.',
  },
  {
    q: "I can't sign in",
    a: 'Use your email and password, at least 8 characters. Or ask for a code. On this phone the demo code is 246810. Forgot password sets a new one on this phone.',
  },
  {
    q: 'How do I upgrade?',
    a: 'Open Menu, then Membership. Leadership Essentials is free. Leadership Plus is £29.99 a month or £323.89 a year, including VAT. Practice subscribe unlocks Plus here and does not take a card.',
  },
  {
    q: 'How do I send feedback?',
    a: 'Open Menu, then Send feedback. It stays on this phone and in the team demo.',
  },
];

export const PRIVACY: { h: string; paragraphs: string[] }[] = [
  {
    h: 'Who we are',
    paragraphs: [
      'Last updated 25 October 2026.',
      'This copy of the EmpathyWorks Leadership app keeps what you enter on this phone. EmpathyWorks Leadership Consultancy is the organisation named in the product. You can contact the team at info@leadershipconsultant.co.uk. The published privacy note says the registered company name, number and address are still to be added, so this screen does not invent an address.',
    ],
  },
  {
    h: 'What stays on this phone',
    paragraphs: [
      'Your name, email, membership, organisation and the reflections, journal, Mirror, surveys, messages, bookings and profile you add.',
      'A practice purchase records Leadership Plus on this phone. No card number is taken and nothing is charged.',
    ],
  },
  {
    h: 'Who can see it',
    paragraphs: [
      'Only you can see your daily reflections, Leadership Mirror, journal and blueprint, unless you flag a journal note for a coaching session.',
      'Other members see what you post in the community, and messages you send them, when you are on Leadership Plus.',
      'Your organisation, in the demo portal, is described as seeing programme participation and culture results only when they are combined. It does not see your individual reflections.',
    ],
  },
  {
    h: 'Your choices',
    paragraphs: [
      'You can edit your profile, switch between Essentials and Plus, sign out, or delete the account by typing DELETE.',
      'Deleting the account removes it from this phone.',
    ],
  },
];

export const SERVICES = [
  {
    id: 'coaching',
    name: 'One-to-One Leadership Coaching',
    short: 'Dedicated space for leaders to think, reflect and develop.',
    body: 'Confidential, challenging and supportive coaching for leaders who want to understand themselves better and navigate the realities of leading people. It combines honest conversation, the Leadership Diagnostic Assessment and practical challenge.',
    includes: [
      'Leadership Diagnostic Assessment',
      'A dedicated Leadership Discovery session',
      'Bespoke one-to-one coaching built around real situations',
      'A Personal Leadership Blueprint, where appropriate',
    ],
  },
  {
    id: 'consultancy',
    name: 'Organisational Leadership & Consultancy',
    short: 'Independent insight when your organisation needs to understand, change or move forward.',
    body: 'Working alongside leadership teams on culture, strategy, organisational development and leadership effectiveness, turning insight into practical action.',
    includes: ['Workplace diagnostics and culture insight', 'Strategic reviews', 'Facilitated conversations', 'Bespoke consultancy'],
  },
  {
    id: 'partnerships',
    name: 'Leadership Subscription Services',
    short: 'An ongoing leadership partnership, not a one-off intervention.',
    body: 'Ongoing access to EmpathyWorks throughout the year, so support starts from an informed position instead of from scratch every time.',
    includes: [
      'Coaching and leadership diagnostics',
      'Consultancy and independent challenge',
      'Senior-team support and facilitated development',
      'Practical leadership resources and tools',
    ],
  },
  {
    id: 'speaking',
    name: 'Speaking, Workshops & Leadership Events',
    short: 'Leadership conversations that stay with people long after the event has finished.',
    body: 'Keynotes, workshops and facilitated events exploring leadership, compassion, accountability, culture, trauma, resilience and performance.',
    includes: ['Keynote and after-dinner speaking', 'Leadership workshops', 'Facilitated leadership events', 'Bespoke sessions'],
  },
];

export const ORG_TIERS = [
  {
    name: 'Leadership Partner',
    price: '£395',
    tag: 'Trusted leadership support when you need it.',
    includes: ['Regular leadership check-ins', 'Selected resources and practical tools', 'Responsive advice within an agreed level of support', 'Preferential access to coaching, consultancy and workshops'],
  },
  {
    name: 'Leadership Development Partner',
    price: '£895',
    tag: 'Ongoing investment in your leaders, teams and culture.',
    includes: ['Everything in Leadership Partner', 'Regular one-to-one coaching', 'Leadership Diagnostic Assessment', 'Senior-team development and workshops', 'Support on culture and workplace experience'],
  },
  {
    name: 'Strategic Leadership Partner',
    price: '£1,950',
    tag: 'The most comprehensive organisational partnership.',
    includes: ['Executive and senior leadership coaching', 'Workplace diagnostics and culture insight', 'Strategic and organisational consultancy', 'Independent challenge to senior leaders', 'Regular strategic conversations'],
  },
];

export const PILLARS = [
  ['Experience', 'Decades of senior leadership'],
  ['Evidence', 'Research-informed practice'],
  ['Humanity', 'The person behind the role'],
  ['Accountability', 'High expectations, held well'],
];

export function money(n: number): string {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function respectful(text: string): boolean {
  const n = text.toLowerCase().replace(/[^a-z\s]/g, '');
  return !/\b(fuck|shit|bitch|bastard|asshole|cunt)\b/.test(n);
}

export const MOD_MSG = "Please keep it respectful. Your message includes language that isn't allowed.";

export function daysAhead(today: string, count = 60): string[] {
  const out: string[] = [];
  for (let i = 1; out.length < count; i++) {
    const d = addDays(today, i);
    const day = new Date(d + 'T12:00:00').getDay();
    if (day !== 0 && day !== 6) out.push(d);
    if (i > 90) break;
  }
  return out;
}
