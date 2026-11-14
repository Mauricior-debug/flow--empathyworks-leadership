export type Membership = 'essentials' | 'plus';
export type Role = 'member' | 'admin';
export type ThemeChoice = 'auto' | 'light' | 'dark';
export type PlanInterval = 'month' | 'year';
export type PostKind = 'Achievement' | 'Question' | 'Conversation';
export type PhotoKey =
  | 'hero'
  | 'hiker'
  | 'reflective'
  | 'steveNeil'
  | 'neilCoaching'
  | 'steveStage'
  | 'steveSuit'
  | 'stevePortrait'
  | 'avSteve'
  | 'avNeil';

export type Person = {
  id: string;
  first: string;
  last: string;
  email: string;
  password: string;
  org: string;
  job: string;
  phone: string;
  bio: string;
  linkedin: string;
  showJob: boolean;
  photo?: string;
  membership: Membership;
  interval: PlanInterval | null;
  role: Role;
  onboarded: boolean;
  coaching: boolean;
  orgPortal: boolean;
  teamKey?: 'steve' | 'neil';
};

export type Daily = {
  userId: string;
  date: string;
  mood: number;
  showing: string[];
  line: string;
  note: string;
};

export type MirrorEntry = {
  userId: string;
  week: string;
  answers: Record<string, number>;
  present: number | null;
  word: string;
  done: boolean;
};

export type JournalEntry = {
  id: string;
  userId: string;
  at: string;
  mood: number | null;
  body: string;
  forSession: boolean;
};

export type Todo = {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  reminder: boolean;
  done: boolean;
};

export type Appointment = {
  id: string;
  userId: string;
  kind: string;
  withKey: 'steve' | 'neil';
  date: string;
  slot: string;
  status: 'confirmed' | 'cancelled';
  zoom: string;
};

export type Workshop = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  format: string;
  facilitator: 'steve' | 'neil';
  date: string;
  time: string;
  places: number;
  price: number;
};

export type Booking = {
  id: string;
  userId: string;
  workshopId: string;
  status: 'booked' | 'cancelled';
  practice: boolean;
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  at: string;
  likes: string[];
};

export type Post = {
  id: string;
  authorId: string;
  kind: PostKind;
  body: string;
  image?: PhotoKey;
  at: string;
  likes: string[];
  comments: Comment[];
};

export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  at: string;
};

export type Thread = {
  id: string;
  title: string;
  memberIds: string[];
  team: boolean;
  messages: ChatMessage[];
};

export type Ask = {
  id: string;
  userId: string;
  question: string;
  askedAt: string;
  answer: string | null;
  answeredAt: string | null;
  from: string;
};

export type Notice = {
  id: string;
  userId: string;
  title: string;
  body: string;
  at: string;
  href?: string;
};

export type SurveyAnswer = {
  userId: string;
  which: 'leadership' | 'culture';
  date: string;
  answers: Record<string, number>;
};

export type ChallengeLog = {
  userId: string;
  week: string;
  status: 'accepted' | 'done' | 'skipped';
  note: string;
};

export type ModuleProgress = {
  userId: string;
  index: number;
  reflections: string[];
  exercise: string;
  application: string;
  done: boolean;
};

export type PlannerNote = {
  userId: string;
  issue: string;
  good: string;
  they: string;
  opening: string;
};

export type Blueprint = {
  userId: string;
  leader: string;
  behaviours: string;
  help: string;
};

export type Objective = {
  id: string;
  userId: string;
  title: string;
  progress: number;
};

export type ActionItem = {
  id: string;
  userId: string;
  title: string;
  done: boolean;
  checkIn: string;
};

export type CoachNote = {
  id: string;
  userId: string;
  date: string;
  body: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  at: string;
};

export type Report = {
  id: string;
  reporterId: string;
  target: string;
  reason: string;
  at: string;
};

export type Block = { blockerId: string; blockedId: string };

export type FeedbackNote = { id: string; userId: string; body: string; at: string };
export type ContactNote = { id: string; name: string; email: string; message: string; at: string };
export type WorkshopRequest = { id: string; userId: string; topic: string; when: string; notes: string; at: string };

export type NotifPrefs = {
  announcements: boolean;
  workshops: boolean;
  todos: boolean;
  messages: boolean;
  community: boolean;
};

export type AppData = {
  version: 1;
  sessionUserId: string | null;
  theme: ThemeChoice;
  big: boolean;
  pushAskHidden: boolean;
  pushOn: boolean;
  getStartedHidden: boolean;
  pendingCodeEmail: string | null;
  people: Person[];
  daily: Daily[];
  mirrors: MirrorEntry[];
  journal: JournalEntry[];
  todos: Todo[];
  appointments: Appointment[];
  workshops: Workshop[];
  bookings: Booking[];
  posts: Post[];
  threads: Thread[];
  asks: Ask[];
  notices: Notice[];
  reads: Record<string, string[]>;
  surveys: SurveyAnswer[];
  challenges: ChallengeLog[];
  academy: ModuleProgress[];
  planners: PlannerNote[];
  blueprints: Blueprint[];
  objectives: Objective[];
  actions: ActionItem[];
  notes: CoachNote[];
  announcements: Announcement[];
  feedback: FeedbackNote[];
  contacts: ContactNote[];
  requests: WorkshopRequest[];
  reports: Report[];
  blocks: Block[];
  saved: Record<string, string[]>;
  communitySeen: Record<string, string>;
  prefs: Record<string, NotifPrefs>;
  articlePublished: Record<string, boolean>;
};

export type Result = { data: AppData; error?: string };
